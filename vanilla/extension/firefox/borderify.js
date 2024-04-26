browser.browserSettings.newTabOverride.get({}).then((result) => {
    console.log(result.value);
    browser.browserSettings.newTabURL.set({value: "index.html"});
});




// .onChanged.addListener((details) => {


//     if (details.value) {
//       browser.browserSettings.newTabURL.set({value: "index.html"});
//     }
//   });