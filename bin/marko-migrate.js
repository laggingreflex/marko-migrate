var options = require('argly')
    .createParser({
        '--help': {
            type: 'string',
            description: 'Show this help message'
        },
        '--syntax -s': {
            type: 'string',
            description: 'The syntax to use for migrated templates. Either "html" (default) or "concise"'
        },
        '--template -t': {
            type: 'string',
            description: 'A single template to migrate'
        },
        '--watch -w': {
            type: 'boolean',
            description: 'Watch and migrate a single template'
        }
    })
    .usage('Usage: $0 [options]')
    .example(
        'Migrate the project in the current directory',
        '$0')
    .example(
        'Migrate the project in the current directory and use the concise syntax for output templates',
        '$0 --syntax concise')
    .validate(function(result) {
        if (result.help) {
            this.printUsage();
            process.exit(0);
        }
    })
    .onError(function(err) {
        this.printUsage();
        console.error(err);
        process.exit(1);
    })
    .parse();


if (options.template) {
    var path = require('path');
    var fs = require('fs');

    var templatePath = path.resolve(process.cwd(), options.template);
    var migrateOptions = {
        syntax: options.syntax || 'html'
    };

    var migrateTemplate = function() {
        console.log('Migrated "' + templatePath + '":');
        var transformed = require('../').transformTemplate(templatePath, migrateOptions);
        console.log('---------------------------');
        console.log(transformed);
        console.log('---------------------------');
    };

    migrateTemplate();

    if (options.watch) {
        fs.watch(templatePath, migrateTemplate);
        console.log('(watching template for changes)');
    }
} else {
    require('../').migrateProject(process.cwd(), options);
}

