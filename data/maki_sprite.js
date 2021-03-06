var fs = require('fs');
var path = require('path');
var sprite = require('node-sprite');

var makipath = './node_modules/maki';

sprite.sprite('renders', { path: makipath }, function(err, makiSprite) {
    if (err) process.exit(1);

    // Move image and json files
    fs.renameSync(path.join(makipath, makiSprite.filename()), './dist/img/maki-sprite.png');
    fs.renameSync(path.join(makipath, 'renders.json'), './data/maki-sprite.json');

    // Generate CSS
    var template = '.maki-{name}{background-position:{x} {y};width:{w};height:{h};}\n';
    var css = "/* This file is generated by make. Do NOT edit manually. */\n\n";
    css += ".maki-icon{background-image:url(img/maki-sprite.png);background-repeat:no-repeat;}\n";

    makiSprite.images.forEach(function(image) {
        if (image.width !== 24) return;
        css += template.replace('{name}', image.name.replace('-24', ''))
            .replace('{x}', '-' + image.positionX + 'px')
            .replace('{y}', '-' + image.positionY + 'px')
            .replace('{w}', image.width + 'px')
            .replace('{h}', image.height + 'px');
    });
    
    fs.writeFileSync('./css/maki-sprite.css', css);
});
