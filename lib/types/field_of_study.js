"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Context = require("../context");
function fieldNameToWikiId(name) {
    return `${name[0].toUpperCase()}${name.slice(1)}`.replace(/ /g, '_');
}
function fieldOfStudyToQuad(entity) {
    let { Id: id, DFN: displayName, FN: normalizedName, FP: parents, FC: children, } = entity;
    let subject = `<http://academic.microsoft.com/#/detail/${id}>`;
    let wikipediaId = fieldNameToWikiId(displayName);
    let quads = [
        { subject, predicate: Context.name, object: displayName },
        { subject, predicate: Context.type, object: Context.AcademicGraph.FieldOfStudy },
        { subject, predicate: Context.sameAs, object: `<http://dbpedia.org/resource/${wikipediaId}>` },
    ];
    if (parents != null) {
        let parentIds = parents.map(x => x.FId);
        quads = [].concat(quads, parentIds.map(parentId => {
            const predicate = Context.AcademicGraph.parentFieldOfStudy;
            const object = `<http://academic.microsoft.com/#/detail/${parentId}>`;
            return { subject, predicate, object };
        }));
    }
    if (children != null) {
        let childIds = children.map(x => x.FId);
        quads = [].concat(quads, childIds.map(childId => {
            const predicate = Context.AcademicGraph.childFieldOfStudy;
            const object = `<http://academic.microsoft.com/#/detail/${childId}>`;
            return { subject, predicate, object };
        }));
    }
    return quads;
}
exports.fieldOfStudyToQuad = fieldOfStudyToQuad;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmllbGRfb2Zfc3R1ZHkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdHlwZXMvZmllbGRfb2Zfc3R1ZHkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSxzQ0FBc0M7QUFFdEMsMkJBQTJCLElBQUk7SUFDN0IsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQ3ZFLENBQUM7QUFFRCw0QkFBbUMsTUFBTTtJQUN2QyxJQUFJLEVBQ0YsRUFBRSxFQUFFLEVBQUUsRUFDTixHQUFHLEVBQUUsV0FBVyxFQUNoQixFQUFFLEVBQUUsY0FBYyxFQUNsQixFQUFFLEVBQUUsT0FBTyxFQUNYLEVBQUUsRUFBRSxRQUFRLEdBQ2IsR0FBRyxNQUFNLENBQUM7SUFFWCxJQUFJLE9BQU8sR0FBRywyQ0FBMkMsRUFBRSxHQUFHLENBQUM7SUFDL0QsSUFBSSxXQUFXLEdBQUcsaUJBQWlCLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDakQsSUFBSSxLQUFLLEdBQUc7UUFDVixFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsT0FBTyxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFFO1FBQ3pELEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxPQUFPLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxPQUFPLENBQUMsYUFBYSxDQUFDLFlBQVksRUFBRTtRQUNoRixFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsT0FBTyxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsZ0NBQWdDLFdBQVcsR0FBRyxFQUFFO0tBQy9GLENBQUM7SUFFRixFQUFFLENBQUMsQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQztRQUNwQixJQUFJLFNBQVMsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUE7UUFDdkMsS0FBSyxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLFNBQVMsQ0FBQyxHQUFHLENBQUMsUUFBUTtZQUM3QyxNQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLGtCQUFrQixDQUFDO1lBQzNELE1BQU0sTUFBTSxHQUFHLDJDQUEyQyxRQUFRLEdBQUcsQ0FBQztZQUN0RSxNQUFNLENBQUMsRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxDQUFDO1FBQ3hDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDTixDQUFDO0lBRUQsRUFBRSxDQUFDLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDckIsSUFBSSxRQUFRLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3hDLEtBQUssR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsR0FBRyxDQUFDLE9BQU87WUFDM0MsTUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQyxpQkFBaUIsQ0FBQztZQUMxRCxNQUFNLE1BQU0sR0FBRywyQ0FBMkMsT0FBTyxHQUFHLENBQUM7WUFDckUsTUFBTSxDQUFDLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsQ0FBQztRQUN4QyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ04sQ0FBQztJQUVELE1BQU0sQ0FBQyxLQUFLLENBQUM7QUFDZixDQUFDO0FBcENELGdEQW9DQyJ9