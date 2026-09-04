/**
 * Plop JS
 * Code generator for LaunchPad Web
 */
module.exports = function (plop) {
  // Component generator
  plop.setGenerator('component', {
    description: 'Create a new component',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Component name (PascalCase):',
      },
      {
        type: 'list',
        name: 'type',
        message: 'Component type:',
        choices: ['ui', 'layout', 'forms', 'page'],
        default: 'ui',
      },
    ],
    actions: function (data) {
      const basePath = data.type === 'page' 
        ? 'src/app/{{dashCase name}}' 
        : 'src/components/{{type}}/{{pascalCase name}}';
      
      const actions = [];
      
      if (data.type === 'page') {
        actions.push({
          type: 'add',
          path: `${basePath}/page.tsx`,
          templateFile: 'plop-templates/page.tsx.hbs',
        });
        actions.push({
          type: 'add',
          path: `${basePath}/layout.tsx`,
          templateFile: 'plop-templates/layout.tsx.hbs',
        });
      } else {
        actions.push({
          type: 'add',
          path: `${basePath}/index.tsx`,
          templateFile: 'plop-templates/component.tsx.hbs',
        });
      }
      
      return actions;
    },
  });

  // Hook generator
  plop.setGenerator('hook', {
    description: 'Create a new custom hook',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Hook name (camelCase, without "use" prefix):',
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'src/hooks/use{{pascalCase name}}.ts',
        templateFile: 'plop-templates/hook.ts.hbs',
      },
    ],
  });

  // Utility function generator
  plop.setGenerator('util', {
    description: 'Create a new utility function',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Utility name (camelCase):',
      },
      {
        type: 'input',
        name: 'description',
        message: 'Short description:',
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'src/lib/{{camelCase name}}.ts',
        templateFile: 'plop-templates/util.ts.hbs',
      },
    ],
  });

  // API route generator
  plop.setGenerator('api', {
    description: 'Create a new API route',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'API route name (kebab-case):',
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'src/app/api/{{dashCase name}}/route.ts',
        templateFile: 'plop-templates/api-route.ts.hbs',
      },
    ],
  });

  // Helper functions
  plop.setHelper('curly', function (object, open) {
    return open ? '{' : '}';
  });
}; 