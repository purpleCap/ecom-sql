import { DatabaseConnectionError } from '../errors/database-connection-error';
import sequelize from '../util/database/database';

const dbConnect = async (startServer: Function) => {
    try {
        await sequelize.sync({ alter: true });
        console.log('database connected!');
        startServer();
    } catch(err: any) {
        console.log(err);
        throw new DatabaseConnectionError();
    }
};

export default dbConnect;