import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { LowSync, JSONFileSync } from 'lowdb';

class Database {
    private collections:{[key:string]: LowSync<any>} = {};

    getCollection(collection:string): LowSync<any> {
        if(this.collections[collection] === undefined) {
            const __dirname = dirname(fileURLToPath(import.meta.url));
            const file = join(__dirname, collection)

            this.collections[collection] = new LowSync(new JSONFileSync(file));
            this.collections[collection].read();
            this.collections[collection].data ||= [];
        }
        return this.collections[collection];
    }

    write(db:LowSync<any>): void {
        try {
            db.write();
        }
        catch(err) {
            console.warn("Database experienced an error writing.", err);
            throw new Error("Database experienced an error writing.");
        }
    }
}

export default new Database();