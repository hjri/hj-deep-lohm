JADE = $(shell find src/jade/*.jade)
HTML = $(patsubst src/jade/%.jade, client/%.html, $(JADE))

all: $(HTML)

client/%.html: src/jade/%.jade
		jade < $< --out $< --path $< --pretty > $@

clean:
		echo $(HTML)
