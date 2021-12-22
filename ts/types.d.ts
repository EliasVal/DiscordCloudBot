import { Client, Collection, Message } from "discord.js";

declare global {
  interface Drive {
    name: string;
    owner: string;
    members: Member[];
    fs: Folder | File;
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
    type: "folder";
    [key: string]: File;
  }

  interface _Client extends Client {
    commands: Collection<string, Command>;
  }

  interface Command {
    description: string;
    name: string;
    aliases?: string[];
    run: function(_Client, Message, string[]);
  }

  var config: {
    prefix: string;
  };

  var appRoot: string;
}

export {}