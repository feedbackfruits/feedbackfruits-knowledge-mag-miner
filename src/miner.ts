// function getPage(url, page = 1, pageSize = 10) {
//   if (pageSize <= 0) throw new Error(`Page size ${pageSize} must be greater than 0.`);
//   let offset = `offset=${(page - 1) * pageSize}`;
//   let count = `count=${pageSize}`;
//   console.log(`Getting page with:`, url, offset, count);
//   return fetch(`${url}&${offset}&${count}`).then(res => res.json());
// }
//
// export function getPages(url, pageSize = 10, startPage = 1, endPage = Infinity) {
//   if (startPage > endPage) throw new Error(`startPage ${startPage} must be less than (or equal to) endPage ${endPage}`);
//   if (startPage === endPage) return Promise.resolve();
//
//   console.log(`Getting page: ${startPage} with size ${pageSize}. Ending at page ${endPage}`);
//
//   return queue.add(() => getPage(url, startPage, pageSize).then(page => {
//     if (!page) throw new Error('Page is empty!');
//     console.log(`Page length: `, page.entities.length);
//     let quads = page.entities.map(fieldOfStudyToQuad).reduce((memo, x) => memo.concat(x), []);
//     return Promise.all(quads.map(sendQuad)).then(() => page);
//   })).then(page => {
//     if (page.entities.length < pageSize) {
//       console.log(`Reached page with smaller size (${page.entities.length}) than expected (${pageSize}). Assuming end of list and quitting.`);
//       return Promise.resolve();
//     }
//
//     console.log(`Continuing getPages to page ${startPage + 1}, ending at page ${endPage}`);
//     return getPages(pageSize, startPage + 1, endPage);
//   });
// }
