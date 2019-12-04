include .env
export $(shell sed 's/=.*//' .env)

clean:
	rm -rf dist/*

install:
	cd src; npm install --production

package:
	cd src; zip -x *.json -r ../dist/code.zip  *

build: install package
	cp -r doc/* dist/
	sed -e 's/CodeUri:.*/CodeUri: oss:\/\/%bucket%\/%templateName%\/code.zip/g' template.yml > dist/template.yml

publish: build
	cd dist; fcat publish
