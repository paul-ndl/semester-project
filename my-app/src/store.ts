import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

import { auth, db } from './db';
import { ref, set, onValue, get, child, push, serverTimestamp} from 'firebase/database';

export interface AppState {
    // state for the app
    tickerValue: number,
    setTickerValue:(val:number)=>void,
    
    // state for the remote db
    signedIn: boolean;
    signIn:()=>void,
    signOut:()=>void
}
export const useStore = create<AppState>()(
    devtools(
        (set, get) => ({
            signedIn:false,
            signIn:()=>set({signedIn:true}),
            signOut:()=>set({signedIn:false}),

            tickerValue:-1,
            setTickerValue:(tickerValue)=>{
                set({tickerValue})
            },
        }),
        {
            name: 'app-state',
        }
    )
)