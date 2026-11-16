export type Task={id:string,title:string,start:string,end:string,days:number[],category:string,priority:string,doneDates:string[],date?:string};
export type Study={id:string,subject:string,content:string,planned:number,actual:number,questions:number,correct:number,notes:string,status:string,date:string};
export type Data={profile:string,goal:number,rest:number[],subjects:Record<number,string[]>,sessions:{theory:number,practice:number,review:number},tasks:Task[],studies:Study[],theme:string,accent:string};
const days=[['Matemática'],['Português'],['Matemática'],['Inglês','Ciências'],['História','Geografia'],['Simulado'],['Redação']];
export const initial:Data={profile:'Estudante',goal:90,rest:[],subjects:Object.fromEntries(days.map((v,i)=>[i,v])),sessions:{theory:25,practice:45,review:20},theme:'dark',accent:'#8aabff',tasks:[{id:'wake',title:'Acordar',start:'06:00',end:'06:15',days:[1,2,3,4,5],category:'Pessoal',priority:'Normal',doneDates:[]},{id:'school',title:'Escola',start:'06:30',end:'12:30',days:[1,2,3,4,5],category:'Escola',priority:'Alta',doneDates:[]},{id:'home',title:'Chegada em casa',start:'12:50',end:'13:10',days:[1,2,3,4,5],category:'Pessoal',priority:'Normal',doneDates:[]},{id:'prep',title:'Preparação para o Colégio Naval',start:'15:00',end:'16:30',days:[1,2,3,4,5],category:'Estudos',priority:'Alta',doneDates:[]},{id:'gym',title:'Academia',start:'20:00',end:'21:30',days:[1,2,3,4,5],category:'Saúde',priority:'Normal',doneDates:[]}]};
export const key=(d=new Date())=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
export function streak(studies:Study[],goal:number,rest:number[],now=new Date()){
 const totals=new Map<string,number>();for(const s of studies)totals.set(s.date,(totals.get(s.date)||0)+Math.max(0,s.actual));
 const daysDone=new Set([...totals].filter(([,minutes])=>minutes>=goal).map(([date])=>date));
 const eligible=(d:Date)=>!rest.includes(d.getDay());
 const today=new Date(now.getFullYear(),now.getMonth(),now.getDate());
 let cursor=new Date(today);if(!daysDone.has(key(cursor))||!eligible(cursor))cursor.setDate(cursor.getDate()-1);
 while(!eligible(cursor))cursor.setDate(cursor.getDate()-1);
 let current=0;for(let i=0;i<3660&&daysDone.has(key(cursor));i++){current++;cursor.setDate(cursor.getDate()-1);while(!eligible(cursor))cursor.setDate(cursor.getDate()-1)}
 let best=0,run=0;for(let i=3659;i>=0;i--){const d=new Date(today);d.setDate(today.getDate()-i);if(!eligible(d))continue;if(daysDone.has(key(d))){run++;best=Math.max(best,run)}else run=0}
 return{current,best,daysDone};
}

