include .env
export $(shell sed 's/=.*//' .env)

publish_name := Image-Resizer
dist := ./dist/$(publish_name)

clean:
	rm -rf dist/*

prepare: 
	mkdir -p $(dist)

install:
	cd src; npm install --production

package: prepare
	cd src; zip -x *.json -r ../$(dist)/code.zip  *

build: install package
	cp -r doc/* $(dist)
	sed -e 's/CodeUri:.*/CodeUri: oss:\/\/%bucket%\/%templateName%\/code.zip/g' template.yml > $(dist)/template.yml

publish: build
	cd $(dist); fcat publish 

publish-prod: build
	cd $(dist); fcat publish -p

unpublish: 
	fcat delete $(publish_name)
