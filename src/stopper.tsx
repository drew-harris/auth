export const Stopper = () => {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script src="https://unpkg.com/@tailwindcss/browser@4"></script>
      </head>
      <body class="bg-[#f5f5fa] font-mono">
        <div class="p-[16px] md:max-w-[700px] m-auto mt-28">
          <fieldset class="border-2 px-8 border-black flex flex-col halftone-shadow p-[16px] bg-white">
            <legend class="font-bold font-mono text-red-500 text-lg px-2">
              ALERT!
            </legend>
            <div class="">
              You are not logged in or you don't have enough permission to view
              this page. If you think this is an error, please contact drew.
            </div>
            <div class="flex py-4 mt-4 gap-8 w-full justify-evenly mx-auto">
              <a href="/login" class="underline">
                Log in with GitHub
              </a>
            </div>
          </fieldset>
        </div>
      </body>
    </html>
  );
};

export const Success = () => {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script src="https://unpkg.com/@tailwindcss/browser@4"></script>
      </head>
      <body class="bg-[#f5f5fa] font-mono">
        <div class="p-[16px] md:max-w-[700px] m-auto mt-28">
          <fieldset class="border-2 px-8 border-black flex flex-col halftone-shadow p-[16px] bg-white">
            <legend class="font-bold font-mono text-green-500 text-lg px-2">
              Success!
            </legend>
            <div class="">You are logged into drewh cloud enterprises.</div>
          </fieldset>
        </div>
      </body>
    </html>
  );
};
