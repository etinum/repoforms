using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Web.Configuration;

namespace WebApi.Utils
{
    public static class Email
    {
        private static readonly SmtpClient Client = new SmtpClient(WebConfigurationManager.AppSettings["smtpserver"]) { UseDefaultCredentials = false };


        public static void SendTest()
        {
            var mailMessage = new MailMessage
            {
                From = new MailAddress("people@gmail.com"),
                Body = "This is a test body",
                Subject = "subject"
            };

            mailMessage.To.Add("ertran@portfoliorecovery.com");
            mailMessage.To.Add("eric.n.tran@gmail.com");
            Client.Send(mailMessage);

        }


        public static void AssignmentWriteUp(string winUser, string investigator, string accountNumber, Boolean debug = true)
        {


            var emailString = debug ? WebConfigurationManager.AppSettings["RepoEmailsDev"] : WebConfigurationManager.AppSettings["RepoEmails"];

            var emails = emailString.Split(';').ToList();

            var mailMessage = new MailMessage
            {
                From = new MailAddress("assignmentwriteup@portfoliorecovery.com"),
                Body = $"There is a new assignment write up completed by: {winUser}({investigator})<br>URL: http://plsf",
                Subject = $"Assignment Write Up for {investigator} ({accountNumber})", 
                IsBodyHtml = true
            };

            foreach (var email in emails)
            {
                mailMessage.To.Add(email);
            }
            Client.Send(mailMessage);

        }
    }
}
