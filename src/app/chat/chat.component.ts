import { UserServiceService } from '../services/user-service.service'; // Importez le service
import { User } from '../modal/user';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BetterDatePipe } from '../better-date.pipe';
import { MessageRequest } from '../modal/message-request';
import { ApiResponse } from '../modal/api-response';

import { ConversationResponse } from '../modal/conversation-response';
import { MessageResponse } from '../modal/message-response';

import { Subscription } from 'rxjs';
import { WebSocketResponse } from '../modal/web-socket-response';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit , OnDestroy{
  errorMessage: string = ''; // Variable pour stocker le message d'erreur
  currentUser: User = {
    userId: 0,
    firstName: '',
    lastName: '',
    email: '',
  };
  // all users except current user
  users: User[] = [];
  // users all conversations
  userConversations: ConversationResponse[] = [];
  // current user conversation subscription
  stompUserSub: Subscription | undefined;

  // selected conversation
  selectedConversationId: number = -1;
  selectedConversationReceiverId: number = -1;
  selectedConversationReceiverName: string = '';
  // selected conversation messages
  selectedConversation: MessageResponse[] = [];
  // selected conversation messages subscription
  stompConvSub: Subscription | undefined;

  // Boolean flag to indicate whether showing users or conversation on left column
  showUserState: boolean = false;
  // Input field for send message
  message: string = '';

  constructor(private userService: UserServiceService ,   private router: Router,) { 
    this.currentUser = userService.currentUser1();
  }

  ngOnInit(): void {
    console.log('ChatComponent initialized');
    this.loadCurrentUser();
    this.subscribeToCurrentUserConversation();
  }
  ngOnDestroy(): void {
    // Unsubscribe from all channels onDestroy
    this.stompUserSub?.unsubscribe();
    this.stompConvSub?.unsubscribe();
  }

  // When click the new/add button Then get all users and set users list
  onShowHideUserConversation() {
    this.showUserState = !this.showUserState;
    if (this.showUserState) {
      this.userService
        .getAllUsersExceptCurrentUser()
        .subscribe((res: ApiResponse) => {
          this.users = res.data;
        });
    }
  }

  // Close a chat from dropdown menu
  onCloseChat() {
    this.stompConvSub?.unsubscribe();
    this.selectedConversationId = -1;
  }

  // When click logout button Then remove user from localStorage and navigate to homepage
  onUserLogout() {
   // localStorage.removeItem('user');
    this.router.navigate(['/projects']);
  }

  subscribeToCurrentUserConversation() {
    // setting one second delayed to successfully connect the stomp to server
    setTimeout(() => {
      this.stompUserSub = this.userService.subscribe(
        'user/' + this.currentUser.userId,
        (payload: any) => {
         
          let res: WebSocketResponse = payload;
          if (res.type == 'ALL') {
            this.userConversations = res.data;
            const found = this.userConversations.find(
              (item) => item.conversationId === this.selectedConversationId
            );
            if (found === undefined) {
              this.onCloseChat();
            }
          }
        }
      );
      // Notify that I'm subscribed to get initial data
      this.userService.send('user', this.currentUser.userId);
    }, 1000);
  }

  // When new or exiting user selected Then set the variables and get the two users
  // conversationId from the database
  onUserSelected(receiverId: number, receiverName: string) {
    this.selectedConversationReceiverId = receiverId;
    this.selectedConversationReceiverName = receiverName;
    this.userService
      .getConversationIdByUser1IdAndUser2Id(receiverId, this.currentUser.userId)
      .subscribe((res: ApiResponse) => {
        console.log('Conversation ID:', res.data);

        this.selectedConversationId = res.data;
        this.onShowHideUserConversation();
        this.setConversation();
      });
  }

  // When user select a conversation from the list
  onConversationSelected(index: number) {
    this.selectedConversationId = this.userConversations[index].conversationId;
    this.selectedConversationReceiverId =
      this.userConversations[index].otherUserId;
      this.selectedConversationReceiverName =
      this.userConversations[index].otherUserName;

    this.setConversation();
  }

  // Set a conversation of selected conversationId
  setConversation() {
    // unsubscribe any previous subscription
    this.stompConvSub?.unsubscribe();
    // then subscribe to selected conversation
    // when get new message then add the message to first of the array
    this.stompConvSub = this.userService.subscribe(
      'conv/' + this.selectedConversationId,
      (payload: any) => {
        let res: WebSocketResponse = payload;
        if (res.type == 'ALL') {
          this.selectedConversation = res.data;
        } else if (res.type == 'ADDED') {
          let msg: MessageResponse = res.data;
          this.selectedConversation.unshift(msg);
        }
      }
    );
    // Notify that I'm subscribed to get initial data
    this.userService.send('conv', this.selectedConversationId);
  }

  // Send message to other user
  onSendMessage() {
    // Si le champ de message est vide, retournez
    if (this.message.trim().length == 0) return;
  
    const timestamp = new Date();
    let body: MessageRequest = {
      conversationId: this.selectedConversationId,
      senderId: this.currentUser.userId, // Accédez directement à userId de this.currentUser
      receiverId: this.selectedConversationReceiverId,
      message: this.message.trim(),
      timestamp: timestamp,
    };
    this.userService.send('sendMessage', body);
    this.message = '';
  }

  // When click Delete chat from the dropdown menu Then delete the conversation
  // with it's all messages
  onDeleteConversation() {
    this.userService.send('deleteConversation', {
      conversationId: this.selectedConversationId,
      user1Id: this.currentUser.userId,
      user2Id: this.selectedConversationReceiverId,
    });
  }

  // When click delete on a message menu Then delete from database Then refresh
  // conversation list
  onDeleteMessage(messageId: number) {
    this.userService.send('deleteMessage', {
      conversationId: this.selectedConversationId,
      messageId: messageId,
    });
  }

  loadCurrentUser(): void {
    console.log('Calling currentUser service');
    this.userService.currentUser().subscribe(
      (user: User) => {
        console.log('Utilisateur actuel : ', user);
        localStorage.setItem('user1', JSON.stringify(user));
      },
      (error: any) => {
        console.error('Erreur lors de la récupération de l\'utilisateur actuel : ', error);
        this.errorMessage = 'Une erreur s\'est produite lors de la récupération de l\'utilisateur.';
      }
    );
  }
}
