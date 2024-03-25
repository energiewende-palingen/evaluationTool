import { createContext } from "react";

export class ServerData
{
	
}

export const ServerContext = createContext<ServerData>(new ServerData());