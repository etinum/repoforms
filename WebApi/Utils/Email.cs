using System.Collections.Generic;
using System.Net.Mail;
using System.Web.Configuration;

namespace WebApi.Utils
{
    public class Email
    {
        private readonly SmtpClient _client;

        public Email()
        {
            var smtpserver = WebConfigurationManager.AppSettings["smtpserver"];
            _client = new SmtpClient(smtpserver) { UseDefaultCredentials = false };
        }

        public void SendTest()
        {
            var mailMessage = new MailMessage
            {
                From = new MailAddress("people@gmail.com"),
                Body = "This is a test body",
                Subject = "subject"
            };

            mailMessage.To.Add("ertran@portfoliorecovery.com");
            mailMessage.To.Add("eric.n.tran@gmail.com");
            _client.Send(mailMessage);

        }


        public void AssignmentWriteUp(List<string> emails, string winUser)
        {

            var mailMessage = new MailMessage
            {
                From = new MailAddress("assignmentwriteup@portfoliorecovery.com"),
                Body = "There is a new assignment write up completed by: " + winUser,
                Subject = "Assignment Write Up", 
                IsBodyHtml = true
            };

            foreach (var email in emails)
            {
                mailMessage.To.Add(email);
            }
            _client.Send(mailMessage);

        }



    }
}
