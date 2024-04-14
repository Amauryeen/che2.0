import { signIn } from "@/auth";

export default function Unauthenticated() {
  return (
    <form
      action={async () => {
        "use server"
        await signIn("azure-ad")
      }}
    >
      <h1>Vous êtes déconnecté.</h1>
      <button type="submit">Se connecter</button>
    </form>
  );
}