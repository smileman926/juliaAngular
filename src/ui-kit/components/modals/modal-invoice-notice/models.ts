export enum InvoiceStatus {
  REMINDERSENT = 'ReminderSent', //"02 - Reminder Sent" value="ReminderSent"
  MAHNUNGSENT = 'MahnungSent',  //"03 - Mahnung Sent" value="MahnungSent"
  REVIEWFORINKASSO = 'ReviewForInkasso', //"04 - Review For Inkasso" value="ReviewForInkasso"
  INKASSOAPPROVED = 'InkassoApproved', //"05 - Inkasso Approved" value="InkassoApproved"
  INKASSO = 'Inkasso', //"06 - Inkasso" value="Inkasso"
  LAWSUIT = 'Lawsuit', //"07 - Lawsuit" value="Lawsuit"
  UNCOLLECTABLE = 'Uncollectable' //"10 - Uncollectable" value="Uncollectable"
}
