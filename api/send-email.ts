import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
console.log(resend)

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    const { to, subject, message } = req.body;

    const data = await resend.emails.send({
      from: "CareFinder <onboarding@resend.dev>",
      to,
      subject,
      html: `
        <h2>${subject}</h2>
        <p>${message}</p>
      `,
    });

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json(error);
  }
}