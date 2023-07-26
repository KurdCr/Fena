export class SendEmailDto {
  userId: string;
  numberOfEmails: number;
  toString() {
    return JSON.stringify({
      numEmails: this.numberOfEmails,
    });
  }
}
