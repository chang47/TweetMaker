var casper = require('casper').create();

casper.start('http://en.wikipedia.org/wiki/Web_scraping', function() {
    this.echo("I'm loaded.");
});

casper.run();