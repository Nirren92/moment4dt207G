import { workexperience} from "./workexperience";

export class WorkExperienceList
{
  
    private WorkExperiencearray:workexperience[] = [];
    private Loaded: Promise<void>;

    constructor(authToken: string)
    {
        this.authToken = authToken;
        //måste säkerställa att data blivit uppladdat till objekt. 
        this.Loaded = this.Initdatabasedata();
    }

    private APIURL = "http://localhost:3000";

    private authToken="";

    //Funktion för att hämta all sparad data
    private async Initdatabasedata()
    {
        try {
            const response = await fetch(this.APIURL+"/api/workexperience", {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.authToken}`}
            });
            let temparray = await response.json();
            //Skapar objekt av datan. 
            this.WorkExperiencearray = temparray.map(element => new workexperience(
            element._id,
            element.companyName,
            element.jobTitle,
            element.location,
            new Date(element.startDate),  
            new Date(element.endDate),
            element.description
            ));
        }
        catch(err)
        {
            console.error("nåt gick fel vid hämtning av data:",err);        
        }
    }

     async deleteworkexperience(id:string)
    {
        try {
            const response = await fetch(this.APIURL+"/api/removeworkexperience/"+id, {
                            method: 'DELETE',
                            headers: {
                                'Content-Type':'application/json',
                                'Authorization': `Bearer ${this.authToken}`
                            },
                        });
        }
        catch(err)
        {
            console.error("nåt gick fel vid borttagning av data:",err);        
        }
    }

    async addworkexperience(data:workexperience)
    {
        try {
            //kontrollerar att indata finns med 
            const { companyname, jobtitle,location,startdate,enddate,description } = data;
            if(!companyname || !jobtitle || !location || !startdate || !enddate || !description)
                {   
                    console.error("Indata saknas.");
                }
            else if(isNaN((new Date(startdate).getTime())) || isNaN((new Date(enddate).getTime())))
                {
                console.error("Datum inkorrekt");
                }
            else
            {
                const response = await fetch(this.APIURL+"/api/addworkexperience", {
                                method: 'POST',
                                headers: {
                                    'Content-Type':'application/json',
                                    'Authorization': `Bearer ${this.authToken}`
                                },
                                body: JSON.stringify(data),
                            });
                return response.status;
                
            }
        }
        catch(err)
        {
            console.error("nåt gick fel vid tillägg av data:",err);
            return null;        
        }
    }

    //jag hade velat gjort om detta och brutit ut detta till en helt egen klass som hanterar användare även i frontend delen. och haft det som inparameter till denna. 
    async settoken(token:string)
    {
        this.authToken = token;
    }

    //denna felhantering här är inte optimal.skulle typ vilja returnera null
    async getalldata(): Promise<workexperience[]>
    {
        try {
            //väntar på att construktor först har hunnit med att ladda
            const response = await fetch(this.APIURL+"/api/workexperience", {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.authToken}`}
            });
            let temparray = await response.json();
            //Skapar objekt av datan. 
            this.WorkExperiencearray = temparray.map(element => new workexperience(
            element._id,
            element.companyName,
            element.jobTitle,
            element.location,
            new Date(element.startDate),  
            new Date(element.endDate),
            element.description
            ));
            return this.WorkExperiencearray;
        }
        catch(err)
        {
            console.error("nåt gick fel vid tillägg av data:",err);
            return this.WorkExperiencearray;        
        }

     
    }
    
}



async function get_data(url_IN)
{
        const response = await fetch(url_IN);
        const data = await response.json();
        return data;
}

