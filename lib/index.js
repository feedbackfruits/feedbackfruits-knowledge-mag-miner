"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const feedbackfruits_knowledge_engine_1 = require("feedbackfruits-knowledge-engine");
const miner_1 = require("./miner");
const Config = require("./config");
function init({ name }) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Starting MAG miner');
        const send = yield feedbackfruits_knowledge_engine_1.Miner({ name, customConfig: Config });
        return miner_1.mine('FieldOfStudy')
            .map(doc => ({ action: 'write', key: doc['@id'], data: doc }))
            .subscribe({
            next: send,
            error: (err) => { console.error(err); throw err; },
            complete: () => {
                console.log('Done mining.');
            }
        });
    });
}
exports.default = init;
if (require.main === module) {
    console.log("Running as script.");
    init({
        name: Config.NAME,
    }).catch(console.error);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUdBLHFGQUFvRjtBQUVwRixtQ0FBK0I7QUFFL0IsbUNBQW1DO0FBT25DLGNBQW1DLEVBQUUsSUFBSSxFQUFlOztRQUN0RCxPQUFPLENBQUMsR0FBRyxDQUFDLG9CQUFvQixDQUFDLENBQUM7UUFDbEMsTUFBTSxJQUFJLEdBQUcsTUFBTSx1Q0FBSyxDQUFDLEVBQUUsSUFBSSxFQUFFLFlBQVksRUFBRSxNQUFvQyxFQUFFLENBQUMsQ0FBQztRQUN2RixNQUFNLENBQUMsWUFBSSxDQUFDLGNBQWMsQ0FBQzthQUN4QixHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7YUFDN0QsU0FBUyxDQUFDO1lBQ1QsSUFBSSxFQUFFLElBQUk7WUFDVixLQUFLLEVBQUUsQ0FBQyxHQUFHLE9BQU8sT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztZQUNsRCxRQUFRLEVBQUU7Z0JBQ1IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQztZQUM5QixDQUFDO1NBQ0YsQ0FBQyxDQUFBO0lBQ04sQ0FBQztDQUFBO0FBWkQsdUJBWUM7QUFJRCxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxLQUFLLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDNUIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0lBQ2xDLElBQUksQ0FBQztRQUNILElBQUksRUFBRSxNQUFNLENBQUMsSUFBSTtLQUNsQixDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUMxQixDQUFDIn0=