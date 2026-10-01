/*
 * ============================================================
 *  SETTINGS — this is the only file you need to edit.
 * ============================================================
 *  Anything marked  ✏️ CHANGE ME  needs your attention.
 *  Keep the quotes ("...") and commas (,) exactly as they are.
 */
window.SITE_CONFIG = {
  // ---------- Names ----------
  senderFullName: "Ngawang Chokdrop", // used on the first screen
  senderShortName: "Chokdrop",        // used in the playful messages
  nickname: "Bubu",                   // used in the big greeting

  // ---------- Greeting ----------
  // The headline becomes:  greeting + ", " + nickname + " ♡"
  greeting: "Happy 1st October",
  revealSubtitle: "There's a letter waiting for you.",

  // ---------- Login ----------
  // Every name she might type. Case and extra spaces are ignored.
  // "Putri" is added because your letter calls her that; remove it if she
  // shouldn't be able to log in with it.
  acceptedNames: ["Bubu", "Putri","Chyntia"],

  // ✏️ CHANGE ME: her birthday password.
  // Format used here: DDMMYYYY  (example: 5 March 2001 -> "05032001")
  // She can type it with or without / - . separators; they are ignored.
  // The value below is only a placeholder. Replace it before you publish.
  password: "20072006",
  passwordHint: "Hint: your birthday, DDMMYYYY", // shown under the password box. Use "" to hide.

  // ============================================================
  //  ✏️ YOUR LETTER — replace everything between the backticks ( ` )
  //  - Leave an empty line between paragraphs.
  //  - A single line break inside a paragraph is kept (that's how the
  //    verses stay as lines).
  //  - Don't type a backtick ( ` ) character inside the text.
  // ============================================================
  letter: {
    greeting: "To my Putri, my Bubu, my favorite person in this world. ♡",

    body: `Happy October 1st, my love. ❤️

If I could turn back time, I would return to every moment when I chose to lie instead of telling you the truth. I would choose honesty, even when it was difficult. I would choose courage, even when I was afraid. Because you deserved the truth from me, not a version of it that made things easier for myself.

I know I hurt you. I know that sometimes, the person who is supposed to make your heart feel safe becomes the very reason it hurts. And knowing that I became that person to you is something I never want to take lightly.

I'm sorry, Putri. Not just because I lost you, not just because things between us fell apart, but because I hurt someone who gave me her love and trusted me with her heart. You deserved better from me, and I should have given you that from the beginning.

I can't erase the things I've done. I can't ask yesterday to forgive me, and I can't expect tomorrow to magically make everything okay. All I can do is face the person I was, take responsibility for my mistakes, and become someone who no longer repeats them.

I don't want to be a better man just because I'm afraid of losing you. I want to become a better man because loving you has made me realize the kind of person I should have been all along.

And if life gives us another chance, I want you to meet that version of me—not through beautiful promises, but through the little things I do every day. Through the truth, even when it's uncomfortable. Through consistency, even when no one is watching. Through actions that make you feel safe enough to trust me again, at your own pace.

My Putri, if our first chapter was a story of love mixed with mistakes, then I hope this next chapter can be a story of growth, honesty, patience, and a love that finally learns how to protect what it holds.

I don't want us to pretend the past never happened. I want us to learn from it. I want us to look back one day and realize that the pain we went through became the reason we learned to love each other more honestly, more gently, and more maturely.

And if I could give this new beginning a promise, it would be this:

No more beautiful lies to hide an ugly truth,
No more careless choices that bring tears to you.
I'll let my actions speak where empty words once stood,
And work each day to become the man I know I should.

I cannot change the past, no matter how I try,
But I can choose the truth from now until goodbye.
And if you let me walk beside you once again,
I'll cherish every sunrise, not just ask to be forgiven.

Because, Putri, you are not just someone I love. You are someone whose heart I should have treated with greater care. You're the person I want to laugh with over the smallest things, share my random thoughts with, tell about my day, and make memories with—even on the most ordinary days when nothing special happens.

It's never been about finding someone perfect. It's about learning to be a better partner to the person you love. And I want to learn that with you, if your heart is willing to give us another chance.

I don't need a perfect love story with you. I want a real one. One where we can be honest, where we can admit when we're wrong, where we can grow without hiding our flaws, and where trust is something we build together rather than something I simply ask you to give me.

I know I cannot demand another chance just because my heart wants you back. Your feelings matter, your healing matters, and your choice matters. I want you to know that I understand this has to be more than me saying the right things today.

But if there's still a little place in your heart for us, I'd love for October 1st to be the beginning of something new. Not a return to exactly what we were, but a chance to build something better than before.

A new month. A new chapter. A new opportunity for me to show you that change is possible.

I cannot promise that I'll never make a mistake again, but I can promise that I will never treat honesty as optional, and I will never use a promise as a substitute for doing the work.

My Bubu, I love you more than these words can properly explain. And I don't want my love to exist only in paragraphs like this. I want it to live in my choices, in my honesty, in my patience, and in the way I treat your heart when things aren't easy.

If I could wish for one thing this October, it wouldn't be a perfect month. It would be the chance to begin again—with a more honest heart, a wiser mind, and a love that understands its responsibilities.

Let the old version of me be the lesson, not the person I continue to be. Let this new chapter be written with truth, not excuses; with effort, not empty promises; with patience, not pressure.

And if we get to write that chapter together, Putri, I hope that one day we'll look at October 1st and smile—not because everything was suddenly fixed, but because it was the day I began proving that I could become the man my words once promised you.

You are deeply loved, Putri. Not because you owe me another chance, and not because I expect you to forget what happened, but because you matter to me in a way I should have always shown through my actions.

Happy October 1st, my love. ❤️

Here's to healing. Here's to honesty. Here's to becoming better, even when it takes time.

And if this is where our new beginning starts, then I hope I spend every day making sure that this time, my actions finally tell the same story as my heart.`,

    signoff: "With all my love,",
    signature: "Your Ngawang. ♡",
  },

  // ---------- Photos ----------
  // Shown under the letter. Put the files in the "images" folder.
  // - alt: a short description for people who use screen readers.
  // - caption: optional text under the photo. Leave "" for none.
  // - featured: true makes that photo full width.
  // A photo whose file is missing is simply left out.
  photos: [
    { src: "images/photo1.jpg", alt: "Photo 1", caption: "" },
    { src: "images/photo2.jpg", alt: "Photo 2", caption: "" },
    { src: "images/us.jpg", alt: "A photo of us", caption: "", featured: true },
  ],

  // ---------- Music ----------
  // Put your MP3 in the "audio" folder. Set file to "" to turn music off.
  music: {
    file: "audio/love-song.mp3",
    title: "Last day on Earth",      // ✏️ CHANGE ME
    artist: "Green day",  // ✏️ CHANGE ME
    volume: 0.7,            // starting volume: 0 (silent) to 1 (full)
    loop: true,
  },

  // ---------- Look and feel ----------
  colors: {
    plum: "#1c0b24",     // deep midnight plum (background)
    cherry: "#4a1230",   // black cherry (glow, depth)
    blush: "#f6bfd0",    // blush pink (buttons, hearts)
    lavender: "#c8b6f0", // lavender (accents, stars)
    cream: "#f8ecdb",    // warm cream (text, letter paper)
  },

  // "full"   = floating hearts, stars, glow
  // "gentle" = fewer particles, calmer
  // "off"    = no particle animation (also used automatically if her phone has
  //            "reduce motion" turned on)
  animation: "full",
};
