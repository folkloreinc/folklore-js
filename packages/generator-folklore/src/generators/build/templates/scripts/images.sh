#! /bin/sh

# ICO
[ -d ./public/static/media/favicon ] || mkdir -p ./public/static/media/favicon
for FILE in ./resources/assets/img/favicon/*.png; do
    filename=$(basename $FILE | cut -f 1 -d '.')
    cp $FILE ./public/static/media/favicon/
    convert $FILE -define icon:auto-resize=64,48,32,16 -compress none ./public/static/media/favicon/$filename.ico;
done

# Facebook
[ -d ./public/static/media/facebook ] || mkdir -p ./public/static/media/facebook
for DIR in ./resources/assets/img/facebook/*; do
    name=$(basename $DIR)
    [ -d ./public/static/media/facebook/$name ] || mkdir -p ./public/static/media/facebook/$name
    ./node_modules/.bin/imagemin $DIR --out-dir=public/static/media/facebook/$name
done

# Submissions
[ -d ./public/static/media/submissions ] || mkdir -p ./public/static/media/submissions
./node_modules/.bin/imagemin ./resources/assets/img/submissions --out-dir=public/static/media/submissions
