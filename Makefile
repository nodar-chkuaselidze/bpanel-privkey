all:
	@npm run babel

babel:
	@npm run babel

watch:
	@npm run watch

clean:
	@npm run clean

lint:
	@npm run lint

test:
	@npm test

.PHONY: all browserify clean lint test
