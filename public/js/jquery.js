
(function(){
var $grid = $('.grid').masonry({
    // options... 
     itemSelector: '.grid-item'
  });
  // layout Masonry after each image loads
  $grid.imagesLoaded().progress( function() {
    $grid.masonry('layout');
    console.log(1)
  });
}());








// (function(){
// var $grid = $('.grid').imagesLoaded( function() {
//     // init Masonry after all images have loaded
//     $grid.masonry({
//       // options...
//       itemSelector: '.grid-item',
//       fitWidth:true
//     });
// });
// }());


// (function(){
// $('#container').imagesLoaded( { background: true }, function() {
//     console.log('#container background image loaded');
//   });
// })();