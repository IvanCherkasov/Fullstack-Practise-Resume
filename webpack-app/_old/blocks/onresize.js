export default function (array, className1, className2){
  var showBlock = document.createElement("div");
  div.className = className1;
  var items = '';
  array.forEach(function(itemarray){
    itemarray.forEach(function(item){
      items += '<div><span>' + item[1] + ': </span><span class="' + className2
        + '"/>' + item[0].offsetWidth + 'px;</span></div>';
    });
  });
  showBlock.innerHTML = items;
  return showBlock;
};
