import { Client, Collection, Message } from "discord.js";

declare global {
  interface Drive {
    name: string;
    owner: string;
    cwd: string;
    members: Member[];
    fs: Object<Folder | File>;
  }

  interface Member {
    id: string;
    perms: "read" | "write";
  }

  interface File {
    type: "file";
    messageID: string;
  }
  
  interface Folder {
    // ! OPTIONAL ONLY FOR DELETION WHEN USING THE LS COMMAND
    type?: "folder";
    [key: string]: File | Folder;
  }

  interface _Client extends Client {
    commands: Collection<string, Command>;
  }

  interface Command {
    description: string;
    name: string;
    aliases?: string[];
    run: function(_Client, Message, string[]);
    syntax: string;
  }

  var config: {
    prefix: string;
    colors: {
      warn: string,
      err: string,
      main: string,
      success: string
    },
    dev: string;
  };

  var appRoot: string;
  
  class Err extends Error {
    constructor(message: string, code: string) {
      super(message),
      this.code = code;
      this.name = "DriveError"
    }
  }
}

export {}