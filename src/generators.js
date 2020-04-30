const path = require('path');
const cwd = path.resolve('.');
const { validName, getConfig } = require('./utils');

const { argv } = process;
const isSimple = argv.includes('--simple');
const config = getConfig();

const component = {
    description: 'Create a component',
    prompts: [
        {
            type: 'input',
            name: 'name',
            message: 'What is your component name?',
            validate: validName('component', 'name')
        },
        {
            when: () => !isSimple,
            type: 'checkbox',
            name: 'options',
            message: 'What do you want to include?',
            default: ['javascript'],
            choices: [
                {
                    name: 'Javascript file',
                    value: {
                        fileName: '{{pascalCase name}}.js',
                        templateName: 'javascript.js.hbs'
                    }
                },
                {
                    name: 'Json Data',
                    value: {
                        fileName: '{{dashCase name}}.json',
                        templateName: 'json.js.hbs'
                    }
                },
                {
                    name: 'Test file',
                    value: {
                        fileName: '{{pascalCase name}}.Spec.js',
                        templateName: 'test.js.hbs'
                    }
                }
            ]
        }
    ],
    actions: ({ options }) => {
        const { componentsDir, scssFilePath, relativeComponentsPath } = config;
        const componentsDirPath = `${cwd}/${componentsDir}`;

        let actions = [
            {
                type: 'add',
                path: `${componentsDirPath}/{{dashCase name}}/{{dashCase name}}.njk`,
                templateFile: './templates/component.js.hbs',
                data: { isSimple: isSimple }
            },
            {
                type: 'add',
                path: `${componentsDirPath}/{{dashCase name}}/{{dashCase name}}.yml`,
                templateFile: './templates/docs.js.hbs'
            },
            {
                type: 'add',
                path: `${componentsDirPath}/{{dashCase name}}/{{dashCase name}}.scss`,
                templateFile: './templates/style.js.hbs'
            },
            {
                type: 'append',
                path: `${cwd}/${scssFilePath}`,
                template: `@import "${relativeComponentsPath}/{{dashCase name}}/{{dashCase name}}";`
            }
        ];

        if (!isSimple) {
            options.forEach(({ fileName, templateName }) => {
                actions = [...actions, {
                    type: 'add',
                    path: `${componentsDirPath}/{{dashCase name}}/${fileName}`,
                    templateFile: `./templates/${templateName}`
                }];
            });
        }

        return actions;
    }
};

const template = {
    description: 'Create a template',
    prompts: [
        {
            type: 'input',
            name: 'name',
            message: 'What is your template name?',
            validate: validName('template', 'name')
        },
        {
            type: 'confirm',
            name: 'isCreateFolder',
            message: 'Do you want to create a folder for template?',
            default: false
        }
    ],
    actions: ({ isCreateFolder }) => {
        let path = `src/templates${isCreateFolder ? '/{{dashCase name}}' : '/'}`;
        let actions = [
            {
                type: 'add',
                path: `${path}/{{dashCase name}}.njk`,
                templateFile: './templates/template.js.hbs'
            },
            {
                type: 'add',
                path: `${path}/{{dashCase name}}.json`,
                templateFile: './templates/json.js.hbs'
            }
        ];

        return actions;
    }
};

module.exports = { component, template };
