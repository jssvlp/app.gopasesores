
import Users from './collections/users';
import ClientController from './collections/clients';
import EmployeeController from './collections/employees';
import RolesController from './collections/roles';
import Permissions from './collections/permissions'


export default {
    users: new Users(),
    clients: new ClientController(),
    employees: new EmployeeController(),
    roles: new RolesController(),
    permissions: new Permissions()
}