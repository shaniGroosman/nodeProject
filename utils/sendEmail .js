// import nodemailer from "nodemailer";

// // פונקציה לשליחת מייל
// // export const sendEmail = async (to, subject, text) => {
// //     try {
// //         // יצירת טראנספורטר (שרת SMTP)
// //         const transporter = nodemailer.createTransport({
// //             service: "gmail", // אפשר להחליף ב-Outlook, Yahoo וכו'
// //             auth: {
// //                 user: "your-email@gmail.com", // הכניסי את המייל שלך
// //                 pass: "your-app-password" // השתמשי בסיסמת אפליקציה (ולא בסיסמה רגילה)
// //             }
// //         });

// //         // פרטי המייל
// //         const mailOptions = {
// //             from: "your-email@gmail.com", // השולח
// //             to, // הנמען
// //             subject, // נושא
// //             text // תוכן ההודעה
// //         };

// //         // שליחת המייל
// //         const info = await transporter.sendMail(mailOptions);
// //         console.log("✅ Email sent: " + info.response);
// //         return { success: true, message: "Email sent successfully" };
// //     } catch (error) {
// //         console.error("❌ Error sending email:", error);
// //         return { success: false, message: "Failed to send email" };
// //     }
// // };

// // פונקציה לשליחת מייל
// export const sendOrderConfirmationEmail = async (to, subject, text) => {
//     try {
//       oAuth2Client.setCredentials({
//         refresh_token: process.env.REFRESH_TOKEN, // השתמש במשתנה סביבה
//       });
  
//       const accessToken = await oAuth2Client.getAccessToken();
  
//       const transporter = nodemailer.createTransport({
//         service: 'gmail',
//         auth: {
//           type: 'OAuth2',
//           user: process.env.EMAIL_USER, // כתובת המייל שלך
//           clientId: CLIENT_ID,
//           clientSecret: CLIENT_SECRET,
//           refreshToken: process.env.REFRESH_TOKEN,
//           accessToken: accessToken,
//         },
//       });
  
//       const mailOptions = {
//         from: process.env.EMAIL_USER,
//         to,
//         subject,
//         text,
//       };
  
//       const info = await transporter.sendMail(mailOptions);
//       console.log("✅ Email sent: " + info.response);
//       return { success: true, message: "Email sent successfully" };
//     } catch (error) {
//       console.error("❌ Error sending email:", error);
//       return { success: false, message: "Failed to send email" };
//     }
//   };
  