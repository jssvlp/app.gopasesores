
import Users from './collections/users';
import ClientController from './collections/clients';


export default {
    users: new Users(),
    clients: new ClientController(),
}