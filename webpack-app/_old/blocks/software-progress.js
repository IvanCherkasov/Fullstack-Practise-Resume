export default function(bars, valueAttr){
  Array.from(bars).forEach(function(bar){
    var progress = bar.getAttribute(valueAttr);
    bar.style.width = progress + "%";
  });
};
