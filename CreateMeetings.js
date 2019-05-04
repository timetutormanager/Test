axios = require('axios'),
expect = require ('expect.js')  
const axiosConnect = axios.create({
    baseURL: 'https://timetutormanager.azurewebsites.net',
    headers: {'Content-Type': 'application/json'}
});
// Создание встречи в календаре (post)
// Добавить позитивные сценарии(валидация), домавить рандом, добавить expect по id 
describe ('Create meeting : expect status 201', () => {
    it ('Create meeting with valid information: expect status 201', async() => {
        let options = {'income': 15,'timeStart': '26/04/2019 10:30:00', 'timeEnd': '26/04/2019 12:00:00', 'isCanceled': false, 'place': 'Лескова', 'client': 'Иван', 'title': '123', 'userId': 10, 'notation': 'qwertyuio'};

        let post = await axiosConnect.post('/v1/meetings/',JSON.stringify(options));
        expect(post.status).to.equal(201);
        expect(post.data.id);
        expect(post.data.title).to.eql('123');
        expect(post.data.userId).to.eql(10); 
        //console.log(post);
        // и так далее. Теперь для вызова аксиоса можно к нему обращаться по имени axiosConnect, типа преднастроенный обьект
    });

    it('Create meeting with valid information: expect status 201', async() => {
       let options = {'income': 15,'timeStart': '26/04/2019 10:30:00', 'timeEnd': '26/04/2019 12:00:00', 'isCanceled': true, 'place': 'Лескова', 'client': 'Иван', 'title': '123', 'userId': 10, 'notation': 'qwertyuio'};

       let post = await axiosConnect.post('/v1/meetings/',JSON.stringify(options));
       expect(post.status).to.equal(201);
       expect(post.data.id);
       expect(post.data.title).to.eql('123');
       expect(post.data.userId).to.eql(10); 
    });  

});

describe ('Create meeting : expect status 404', () => {
    it('Create meeting: client with incorrect type (numb): expect status 404', async() => {   
        let options = {'timeStart': '01/05/2019 21:00:00', 'timeEnd': '01/05/2019 21:00:00', 'client': 123};

        let post = await axiosConnect.post('/v1/meetings/',JSON.stringify(options)).catch( (e) => {
            // console.log(e);
            expect(e.response.status).to.equal(404);
        });              
        // console.log(post);    
    });

    it ('Creating a meeting when tineStart = timeEnd: expect status 404', async() => {   
        let options = {'timeStart': '01/05/2019 21:00:00', 'timeEnd': '01/05/2019 21:00:00', 'client': 'Чехов А.П.'};

        let post = await axiosConnect.post('/v1/meetings/',JSON.stringify(options)).catch( (e) => {
            // console.log(e);
            expect(e.response.status).to.equal(404);
        });              
        // console.log(post);         
    });

    it('Creating a meeting when the end date of the meeting differs from the beginning by the month: expect status 404', async() => {   
        let options = {"timeStart": "01/05/2019 19:30:00", "timeEnd": "01/06/2019 21:00:00", "client": "Максим Ш."};

        let post = await axiosConnect.post('/v1/meetings/',JSON.stringify(options)).catch( (e) => {
            // console.log(e);
            expect(e.response.status).to.equal(404);
        });              
        // console.log(post);       
    });

    it('Create meeting: income with incorrect type (string): expect status 404', async() => {
        let options = {'income':'150','timeStart': '26/04/2019 10:30:00', 'timeEnd': '26/04/2019 12:00:00',  'client': 'Иван'};
        
        let post = await axiosConnect.post('/v1/meetings/',JSON.stringify(options)).catch( (e) => {
            // console.log(e);
            expect(e.response.status).to.equal(404);
        });         
    });

    it('Create meeting: place with incorrect type (numb): expect status 404', async() => {
        let options = {'timeStart': '26/04/2019 10:30:00', 'timeEnd': '26/04/2019 12:00:00',  'client': 'Иван', 'place': 123};
        
        let post = await axiosConnect.post('/v1/meetings/',JSON.stringify(options)).catch( (e) => {
            // console.log(e);
            expect(e.response.status).to.equal(404);
        });  
    });

    it('Create meeting: title with incorrect type (numb): expect status 404', async() => {
        let options = {'timeStart': '26/04/2019 10:30:00', 'timeEnd': '26/04/2019 12:00:00',  'client': 'Иван', 'title': 123};
        
        let post = await axiosConnect.post('/v1/meetings/',JSON.stringify(options)).catch( (e) => {
            // console.log(e);
            expect(e.response.status).to.equal(404);
        });  
    });

    it('Create meeting: notation with incorrect type (numb): expect status 4', async() => {
        let options = {'timeStart': '26/04/2019 10:30:00', 'timeEnd': '26/04/2019 12:00:00',  'client': 'Иван', 'notation': 123};
        
        let post = await axiosConnect.post('/v1/meetings/',JSON.stringify(options)).catch( (e) => {
            // console.log(e);
            expect(e.response.status).to.equal(404);
        });     
    });

    it('Create meeting: adding nonexistent field and value: expect status 404', async() => {
        let options = {'income': 15,'timeStart': '26/04/2019 10:30:00', 'timeEnd': '26/04/2019 12:00:00', 'isCanceled': true, 'place': 'Лескова', 'client': 'Иван', 'title': '123', 'userId': 10, 'notation': 'qwertyuio','clone':'string'};
        
        let post = await axiosConnect.post('/v1/meetings/',JSON.stringify(options)).catch( (e) => {
            // console.log(e);
            expect(e.response.status).to.equal(404);
        });       
    });

    it('Create meeting: no client field: expect status 404', async() => {
        let options = {'timeStart': '26/04/2019 10:30:00', 'timeEnd': '26/04/2019 12:00:00'};
        
        let post = await axiosConnect.post('/v1/meetings/',JSON.stringify(options)).catch( (e) => {
            // console.log(e);
            expect(e.response.status).to.equal(404);
        });              
    });

    it('Create meeting: no timeStart field: expect status 404', async() => {
        let options = {'client':'Иван', 'timeEnd': '26/04/2019 12:00:00'};

        await axiosConnect.post('/v1/meetings/',JSON.stringify(options)).catch( (e) => {
            // console.log(e);
            expect(e.response.status).to.equal(404);
        });  
    });

    it('Create meeting: no timeEnd field: expect status 404', async() => {
        let options = {'client':'Иван', 'timeStart': '26/04/2019 12:00:00'};

        await axiosConnect.post('/v1/meetings/',JSON.stringify(options)).catch( (e) => {
            // console.log(e);
            expect(e.response.status).to.equal(404);
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