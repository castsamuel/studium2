export type Task={id:string,title:string,start:string,end:string,days:number[],category:string,priority:string,doneDates:string[],date?:string};
export type Study={id:string,subject:string,content:string,planned:number,actual:number,questions:number,correct:number,notes:string,status:string,date:string};
export type Data={profile:string,goal:number,rest:number[],subjects:Record<number,string[]>,sessions:{theory:number,practice:number,review:number},tasks:Task[],studies:Study[],theme:string,accent:string};
const days=[['Matemática'],['Português'],['Matemática'],['Inglês','Ciências'],['História','Geografia'],['Simulado'],['Redação']];
export const initial:Data={profile:'Estudante',goal:90,rest:[],subjects:Object.fromEntries(days.map((v,i)=>[i,v])),sessions:{theory:25,practice:45,review:20},theme:'dark',accent:'#8aabff',tasks:[{id:'wake',title:'Acordar',start:'06:00',end:'06:15',days:[1,2,3,4,5],category:'Pessoal',priority:'Normal',doneDates:[]},{id:'school',title:'Escola',start:'06:30',end:'12:30',days:[1,2,3,4,5],category:'Escola',priority:'Alta',doneDates:[]},{id:'home',title:'Chegada em casa',start:'12:50',end:'13:10',days:[1,2,3,4,5],category:'Pessoal',priority:'Normal',doneDates:[]},{id:'prep',title:'Preparação para o Colégio Naval',start:'15:00',end:'16:30',days:[1,2,3,4,5],category:'Estudos',priority:'Alta',doneDates:[]},{id:'gym',title:'Academia',start:'20:00',end:'21:30',days:[1,2,3,4,5],category:'Saúde',priority:'Normal',doneDates:[]}]};
export const key=(d=new Date())=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const record=(v:unknown):Record<string,unknown>=>v&&typeof v==='object'&&!Array.isArray(v)?v as Record<string,unknown>:{};
const text=(v:unknown,fallback:string)=>typeof v==='string'?v:fallback;
const number=(v:unknown,fallback:number,min=0)=>typeof v==='number'&&Number.isFinite(v)?Math.max(min,v):fallback;
export function normalize(value:unknown):Data{
 const raw=record(value),rawSubjects=record(raw.subjects),rawSessions=record(raw.sessions);
 const subjects:Record<number,string[]>={};for(let day=0;day<7;day++){const entry=rawSubjects[day];subjects[day]=Array.isArray(entry)?entry.filter((x):x is string=>typeof x==='string').map(x=>x.trim()).filter(Boolean):[...(initial.subjects[day]||[])];}
 const tasks:Task[]=Array.isArray(raw.tasks)?raw.tasks.filter(x=>Object.keys(record(x)).length>0).map((x,i)=>{const t=record(x);return{id:text(t.id,`task-${i}`),title:text(t.title,'Nova atividade'),start:text(t.start,'17:00'),end:text(t.end,'18:00'),days:Array.isArray(t.days)?t.days.filter((n):n is number=>Number.isInteger(n)&&n>=0&&n<7):[],category:text(t.category,'Pessoal'),priority:text(t.priority,'Normal'),doneDates:Array.isArray(t.doneDates)?t.doneDates.filter((d):d is string=>typeof d==='string'):[],...(typeof t.date==='string'?{date:t.date}:{})}}):initial.tasks.map(t=>({...t,days:[...t.days],doneDates:[...t.doneDates]}));
 const studies:Study[]=Array.isArray(raw.studies)?raw.studies.filter(x=>Object.keys(record(x)).length>0).map((x,i)=>{const s=record(x);return{id:text(s.id,`study-${i}`),subject:text(s.subject,'Matemática'),content:text(s.content,''),planned:number(s.planned,90),actual:number(s.actual,0),questions:number(s.questions,0),correct:number(s.correct,0),notes:text(s.notes,''),status:text(s.status,'Pendente'),date:text(s.date,key())}}):[];
 const rest=Array.isArray(raw.rest)?raw.rest.filter((n):n is number=>Number.isInteger(n)&&n>=0&&n<7):[];
 return{profile:text(raw.profile,initial.profile),goal:number(raw.goal,initial.goal,1),rest,subjects,sessions:{theory:number(rawSessions.theory,initial.sessions.theory),practice:number(rawSessions.practice,initial.sessions.practice),review:number(rawSessions.review,initial.sessions.review)},tasks,studies,theme:raw.theme==='light'?'light':'dark',accent:/^#[\da-f]{6}$/i.test(text(raw.accent,''))?String(raw.accent):initial.accent};
}
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

