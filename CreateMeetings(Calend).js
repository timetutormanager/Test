const authClient = require ('./clientCreator.js');
axios = require('axios'),
settings = require('./settings'),
expect = require ('expect.js');
'use strict';

function checkNewDates(meetings) {
    let endTimes = [];
    for (let i=0; i  < meetings.data.meetings.length; i++) {
        endTimes[i] = Date.parse(meetings.data.meetings[i].timeEnd);    
    };
    function compareNum(a,b) {
        if (a > b) return 1;
        if (a < b) return -1;
    }
    endTimes.sort(compareNum);
    let offset = (new Date(endTimes[endTimes.length-1]).getTimezoneOffset())*60000;
    let nextMeetingStartDate = (new Date(endTimes[endTimes.length-1]-offset+1800000));
    let nextMeetingEndDate = (new Date(endTimes[endTimes.length-1]-offset+3600000));    
    let nextMeetingStartString = `${nextMeetingStartDate.getFullYear()}.${addNull(nextMeetingStartDate.getMonth()+1)}.${addNull(nextMeetingStartDate.getDate())} ${addNull(nextMeetingStartDate.getUTCHours())}:${addNull(nextMeetingStartDate.getMinutes())}`;
    let nextMeetingEndString = `${nextMeetingEndDate.getFullYear()}.${addNull(nextMeetingEndDate.getMonth()+1)}.${addNull(nextMeetingEndDate.getDate())} ${addNull(nextMeetingEndDate.getUTCHours())}:${addNull(nextMeetingEndDate.getMinutes())}`;
    let datesObj = {
        start: nextMeetingStartString,
        end: nextMeetingEndString
    };
    return datesObj;
}

function addNull(number) {
    let newStr;
    if (number < 10) {
        newStr = `0${number}`;
        return newStr;
    } else {
        newStr = number.toString();
        return newStr;
    }
}

// describe('Create meeting: create token: expect status 201', () => {
//     let client;
//     beforeEach (async () => {
//       client = await authClient.postClient(settings.login,settings.password);
//     });

//     it('Create: expect status 201', async() => {
//        const createMeeting = await client. post('/v1/Meetings',{'income': 15,'timeStart': '2019.05.24 10:40:00', 'timeEnd': '2019.05.24 10:45:00', 'isCanceled': false, 'place': 'Лескова', 'client': 'Тест Автотест', 'title': '123', 'userId': 10, 'notation': 'qwertyuio'});
//     //    console.log(createMeeting);
//        expect(createMeeting.status).to.equal(201);
//        expect(createMeeting.data.id).to.be.ok();
//        expect(createMeeting.data.title).to.eql('123');
//        expect(createMeeting.data.userId).to.be.ok(); 
//     });  

//     it('Get meeting: expect status 200', async() => {
//         const getMeeting = await client.get('/v1/Meetings');
//         expect(getMeeting.status).to.equal(200);
//         let newMeetingDate = checkNewDates(getMeeting);
//         console.log(newMeetingDate.start);
//         console.log(newMeetingDate.end);
//         const createMeeting = await client. post('/v1/Meetings',{'income': 15,'timeStart': newMeetingDate.start, 'timeEnd': newMeetingDate.end, 'isCanceled': false, 'place': 'Лескова', 'client': 'Тест Автотест', 'title': '123', 'userId': 10, 'notation': 'qwertyuio'});
//         expect(createMeeting.status).to.equal(201);
//         expect(createMeeting.data.id).to.be.ok();
//         expect(createMeeting.data.userId).to.be.ok();
//     });   

// });      

describe('Create meeting : expect status 201', () => {
    let client;
    beforeEach (async () => {
      client = await authClient.postClient(settings.login,settings.password);
    });

    it('Create meeting with valid information(bool-false): expect status 201', async() => {
        const getMeeting = await client.get('/v1/Meetings');
        let newMeetingDate = checkNewDates(getMeeting);
        let options = {'income': 15,'timeStart': newMeetingDate.start, 'timeEnd': newMeetingDate.end, 'isCanceled': false, 'place': 'Лескова', 'client': 'Тест Автотест', 'title': '123', 'userId': 10, 'notation': 'qwertyuio'};

        let post = await client.post('/v1/meetings/',options);
        console.log(post.data);
        expect(post.status).to.equal(201);
        expect(post.data.id).to.be.ok();
        expect(post.data.title).to.eql('123');
        expect(post.data.createdAt).to.be.ok();
        expect(post.data.lastUpdatedAt).to.be.ok();
        expect(post.data.userId).to.be.ok(); 
    });

    it('Create meeting with valid information (bool-true): expect status 201', async() => {
       const getMeeting = await client.get('/v1/Meetings');
       let newMeetingDate = checkNewDates(getMeeting);
       let options = {'income': 15,'timeStart': newMeetingDate.start, 'timeEnd': newMeetingDate.end, 'isCanceled': true, 'place': 'Лескова', 'client': 'Иван', 'title': '123', 'userId': 10, 'notation': 'qwertyuio'};

       let post = await client.post('/v1/meetings/',options);
       expect(post.status).to.equal(201);
       expect(post.status).to.equal(201);
       expect(post.data.id).to.be.ok();
       expect(post.data.title).to.eql('123');
       expect(post.data.createdAt).to.be.ok();
       expect(post.data.lastUpdatedAt).to.be.ok();
       expect(post.data.userId).to.be.ok(); 
    });  

});

describe('Create meeting : expect status 400', () => {
    let client;
    beforeEach (async () => {
      client = await authClient.postClient(settings.login,settings.password);
    });

    it('Create meeting: client with incorrect type (numb): expect status 400', async() => { 
        const getMeeting = await client.get('/v1/Meetings');
        let newMeetingDate = checkNewDates(getMeeting);  
        let options = {'timeStart': newMeetingDate.start, 'timeEnd': newMeetingDate.end, 'client': 123};

        await client.post('/v1/meetings/',options).catch( (e) => {
            // console.log(e);
            expect(e.response.status).to.equal(400);
        });              
        // console.log(post);    
    });

    it ('Creating a meeting when tineStart = timeEnd: expect status 400', async() => {   
        const getMeeting = await client.get('/v1/Meetings');
        let newMeetingDate = checkNewDates(getMeeting);  
        let options = {'timeStart': newMeetingDate.start, 'timeEnd': newMeetingDate.start, 'client': 'Чехов А.П.'};

        await client.post('/v1/meetings/',options).catch( (e) => {
            // console.log(e);
            expect(e.response.status).to.equal(400);
        });              
        // console.log(post);         
    });

    it('Creating a meeting when the end date of the meeting differs from the beginning by the month: expect status 400', async() => { 
        const getMeeting = await client.get('/v1/Meetings');
        let newMeetingDate = checkNewDates(getMeeting);    
        let options = {'timeStart': newMeetingDate.start, 'timeEnd':newMeetingDate.start , 'client': 'Максим'};

        await client.post('/v1/meetings/',options).catch( (e) => {
        // console.log(e);
            expect(e.response.status).to.equal(400);
        });              
        // console.log(post);       
    });

    it('Create meeting: income with incorrect type (string): expect status 400', async() => {
        const getMeeting = await client.get('/v1/Meetings');
        let newMeetingDate = checkNewDates(getMeeting);    
        let options = {'income':'150','timeStart': newMeetingDate.start, 'timeEnd': newMeetingDate.end,  'client': 'Иван'};
        
        await client.post('/v1/meetings/',options).catch( (e) => {
            // console.log(e);
            expect(e.response.status).to.equal(400);
        });         
    });

    it('Create meeting: place with incorrect type (numb): expect status 400', async() => {
        const getMeeting = await client.get('/v1/Meetings');
        let newMeetingDate = checkNewDates(getMeeting);    
        let options = {'timeStart': newMeetingDate.start, 'timeEnd': newMeetingDate.end,  'client': 'Иван', 'place': 123};
        
        await client.post('/v1/meetings/',options).catch( (e) => {
            // console.log(e);
            expect(e.response.status).to.equal(400);
        });  
    });

    it('Create meeting: title with incorrect type (numb): expect status 400', async() => {
        const getMeeting = await client.get('/v1/Meetings');
        let newMeetingDate = checkNewDates(getMeeting);    
        let options = {'timeStart': newMeetingDate.start, 'timeEnd': newMeetingDate.end,  'client': 'Иван', 'title': 123};
        
        await client.post('/v1/meetings/',options).catch( (e) => {
            // console.log(e);
            expect(e.response.status).to.equal(400);
        });  
    });

    it('Create meeting: notation with incorrect type (numb): expect status 400', async() => {
        const getMeeting = await client.get('/v1/Meetings');
        let newMeetingDate = checkNewDates(getMeeting);  
        let options = {'timeStart': newMeetingDate, 'timeEnd': newMeetingDate,  'client': 'Иван', 'notation': 123};
        
        await client.post('/v1/meetings/',options).catch( (e) => {
            // console.log(e);
            expect(e.response.status).to.equal(400);
        });     
    });

    it('Create meeting: adding nonexistent field and value: expect status 400', async() => {
        const getMeeting = await client.get('/v1/Meetings');
        let newMeetingDate = checkNewDates(getMeeting);  
        let options = {'income': 15,'timeStart': newMeetingDate.start, 'timeEnd': newMeetingDate.end, 'isCanceled': true, 'place': 'Лескова', 'client': 'Иван', 'title': '123', 'userId': 10, 'notation': 'qwertyuio','clone':'string'};
        
        await client.post('/v1/meetings/',options).catch( (e) => {
            // console.log(e);
            expect(e.response.status).to.equal(400);
        });       
    });

    it('Create meeting: no client field: expect status 400', async() => {
        const getMeeting = await client.get('/v1/Meetings');
        let newMeetingDate = checkNewDates(getMeeting);  
        let options = {'timeStart': newMeetingDate.start, 'timeEnd': newMeetingDate.start};
        
        await client.post('/v1/meetings/',options).catch( (e) => {
            // console.log(e);
            expect(e.response.status).to.equal(400);
        });              
    });

    it('Create meeting: no timeStart field: expect status 400', async() => {
        const getMeeting = await client.get('/v1/Meetings');
        let newMeetingDate = checkNewDates(getMeeting);  
        let options = {'client':'Иван', 'timeEnd': newMeetingDate.end};

        await client.post('/v1/meetings/',options).catch( (e) => {
            // console.log(e);
            expect(e.response.status).to.equal(400);
        });  
    });

    it('Create meeting: no timeEnd field: expect status 400', async() => {
        const getMeeting = await client.get('/v1/Meetings');
        let newMeetingDate = checkNewDates(getMeeting);  
        let options = {'client':'Иван', 'timeStart': newMeetingDate.start};

        await client.post('/v1/meetings/',options).catch( (e) => {
            // console.log(e);
            expect(e.response.status).to.equal(400);
        });  
    });

    it('Create meeting: absence of all fields: expect status 400', async() => {
        const getMeeting = await client.get('/v1/Meetings');
        let newMeetingDate = checkNewDates(getMeeting); 
        let options = {'client':'Иван', 'timeStart': newMeetingDate.start};

        await client.post('/v1/meetings/',options).catch( (e) => {
            //console.log(e);
            expect(e.response.status).to.equal(400);
        });  
    });      
  
    // it ('Get test by id', async() => {

    //     let testGet = await axiosConnect.get('/v1/meetings/2');
    //     console.log(testGet.data);
    //     expect(testGet.status).to.equal(200);
    // });

    // it ('Get test by WeekDay', async() => {

    //     let testGet = await axiosConnect.get('/v1/meetings/?dayWeek=0');
    //     console.log(testGet.data);
    //     expect(testGet.status).to.equal(200);
    // });
});