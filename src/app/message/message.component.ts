import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { catchError, finalize, Subject, takeUntil } from 'rxjs';
import { MessageService } from '../message.service';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {
  
  public source = interval(6000);
  public subscription: Subscription = this.source.subscribe(val => this.callEveryOne());

  faUser = faUser;
  users: any = [{ nome: 'Bruno', usuarioId: 423 }, { nome: 'Mineia', usuarioId: 666 }];
  messages: any = [{ nome: 'Bruno', mensagem: 'Fala ai irmão', external: true }, { nome: 'Mineia', mensagem: 'Machista', external: true }, { nome: 'Douglas', mensagem: 'Eu mesmo tem como nao', external: false }];
  destinatarioMessage: number = 0;
  destinatarioId: string = '';

  private ngUnsubscribe = new Subject();
  public showLoader: boolean = false
  public serverError: boolean = false;;

  constructor(public messageService: MessageService) { }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  
  ngOnInit(): void {
    this.messageService.listUsers()
      .pipe(takeUntil(this.ngUnsubscribe),
        catchError((err: any) => {
          if (err.status >= 404)
            this.listUser();
          throw err;
        }))
      .subscribe((data) => {
        this.users = data
      });
    this.getMessage();
  }

  public callEveryOne() {
    this.getMessage();
    this.listUser();
  }

  public getMessage() {
    this.messageService.getMessage()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data) => {
        this.messages = data
      });
  }

  public sendMessage(event: any) {
    let message = (<HTMLInputElement>document.getElementById("sendMessageInput")).value;
    this.messageService.sendMessage({ usuarioId: this.destinatarioMessage, mensagem: message })
      .subscribe(data => console.log(data))
  }

  public listUser() {
    this.messageService.listUsers()
      .subscribe((data) => {
        this.users = data
      })
  }

  public listMessage() {
    this.messageService.getMessage()
      .subscribe((data) => {
        this.messages.push(data)
      })
  }

  public clickUser(event: any) {
    if (this.destinatarioMessage == event)
      this.destinatarioMessage = 0;
    else
      this.destinatarioMessage = event;
  }
}
