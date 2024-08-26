import { WorkExperienceList} from "./listworkexperience";
import { workexperience} from "./workexperience";

//DOM event
document.addEventListener("DOMContentLoaded",init);
const form = document.getElementById('inputform');

const loggain = document.getElementById("loggain") as HTMLFormElement;
const adduser = document.getElementById("adduser") as HTMLFormElement;

interface Formloggain {
    username: string;
    password: string;
}


const token = localStorage.getItem("jwt");


//variabler globala
const worklists:WorkExperienceList = new WorkExperienceList(token || "");

//hämtar data från form
async function submitform(event:Event)
{
    //hindrar default inställningar på form
    event.preventDefault();

    //kontrollerar att det är korrekt format(form)
    if(event.target instanceof HTMLFormElement)
    {
        const data = Object.fromEntries(new FormData(event.target).entries()) as unknown as workexperience;
        console.log("Submit",data);
        const addok = await worklists.addworkexperience(data);
        //gick det bra att lägga till data i databasen läggs den även till manuellt i frontend utan ett API anrop för att undvika onödigt anrop
        console.log("statuws: "+addok);
        if(addok==201)
        {
            addrow(data as workexperience);
        }
        else
        {
            alert("Kontrollera inmatningsdata");
        }
    }
}

const APIURL = "https://moment4dt207g.onrender.com";


async function submitadduser(event:Event)
{
    //hindrar default inställningar på form
    event.preventDefault();

    const formData = new FormData(adduser);
    const fields: Formloggain = {
        username: formData.get("username") as string,
        password: formData.get("password") as string
    };
    console.log(fields);
    try
    {
        const response = await fetch(APIURL+"/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(fields),
        });
        
       
        
    }
    catch(error)
    {
        console.error("Nåtgick fel"+error);
    }
}


async function submitloggain(event:Event)
{
    //hindrar default inställningar på form
    event.preventDefault();
    try
    {
    const formData = new FormData(loggain);
    const fields: Formloggain = {
        username: formData.get("username") as string,
        password: formData.get("password") as string
    };

    
        const response = await fetch(APIURL+"/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(fields),
        });
      
        if(response.status==200)
        {            
            const result = await response.json();
            worklists.settoken(result.token);
            localStorage.setItem("jwt",result.token)
            //hämtar data
            
            const experiences = await worklists.getalldata();
            experiences.forEach(element => {
            addrow(element);
        });
        }
        
    }
    catch(error)
    {
        console.error("Nåtgick fel"+error);
    }
}


//Init funktion när data laddas in från databas
async function init() {
    try
    {
        const token = localStorage.getItem("jwt");
       
        if(token)
        worklists.settoken(token);
        const experiences = await worklists.getalldata();
        experiences.forEach(element => {
            addrow(element);
        });

        const currentPath = window.location.pathname;
        if (!token && currentPath !== "/index.html" ) {
            window.location.href = "index.html";
            return;
        }
        if(form)
        form.addEventListener('submit',submitform );
        if(loggain)
        loggain.addEventListener('submit',submitloggain );
        if(adduser)
        adduser.addEventListener('submit',submitadduser );
    }
    catch(error)
    {
        console.error("error"+error);        
    }
}



function addrow(data:workexperience)
{
    
    let experiencelist:any = document.getElementById("experiencelist")
    //lägger till data i en details med berörd information 
    if(experiencelist)
    {
        const details = document.createElement('details');
        details.classList.add('details');
        const summary = document.createElement('summary');
        summary.textContent = "Företag: "+data.companyname +" - "+data.jobtitle+" - "+ getYear(data.startdate)+"-"+getMonth(data.startdate)+" - "+ getYear(data.enddate)+"-"+getMonth(data.enddate);
        const p1 = document.createElement('p');
        p1.textContent = data.description;
        
        details.appendChild(p1);
        const p2 = document.createElement('p');
        p2.textContent ="Placeringsort: "+ data.location;
        details.appendChild(p2);


        details.appendChild(summary);
       


        //skapar knapp för att kunna radera objektet. 
        let deletebutton:Element = document.createElement("button");
        deletebutton.textContent = "Delete"
        deletebutton.addEventListener("click",function(){
            console.log("denna tas bort"+data.id);
            worklists.deleteworkexperience(data.id);
            details.remove();
        });
        details.appendChild(deletebutton);    
        experiencelist.appendChild(details);

    }
    else
    {
        console.error("nåt gick fel vid hämtning av tabell.")
    }
}

//får årtal i format YYYY
function getYear(strdate:Date):number
{
    const date = new Date(strdate);
    return date.getFullYear();
}
//får månad i format MM
function getMonth(strdate:Date):string
{
    //månad börjar på 0varav +1
    const date = new Date(strdate);
    return (date.getMonth() + 1).toString().padStart(2, '0');
}