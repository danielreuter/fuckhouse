export const BLUEPRINT_DESC = `
# The Blueprint Tree
A Blueprint Tree is a JSON representation of a React application. It allows users to create their own React applications in natural language simply by asking an AI language model to generate a series of nested Blueprints for them. Slip -- the website that users are interacting with --
then takes these AI-generated Blueprints and renders them into a dynamic React application, one that is instantly usable and can be further customized by the user.

## Styling
You can only use Tailwind for styling! Declare a className prop to any component (this can be either a static declarator or an expression declarator).

## Tips for functions
The JavaScript body of a function can ONLY use variables or functions that have been declared above it, or that are passed in as args, or that are imported and aliased from other components!

## JavaScript runtime
Each JavaScript script has within its scope each of the variables defined inside of the component, as well as any that have been imported.

So if the component has defined state called "color" and a function called "incrementCounter", then the JavaScript runtime will have access to the variables "color" and "incrementCounter" -- you don't need to namespace it with state.color or state.incrementCounter.

They also have access to the set function. This allows you to modify the internal state of the component. 

It works as a shallow merge, similar to a dispatch. The syntax is: set({ key1: value1, key2: value2 }). This will overwrite key1 and key2, leaving other state variables untouched.

## Using references
References are used to point to data in other parts of the Blueprint. They contain the path to the requested data.

There are two types of references:

- External References: These are used to refer to data in other components. They start with the id of the component, followed by a slash and then the path to the data. For example, whale/user.id references the id property of the user variable of the component with id 'whale'.

- Internal References: These are used to refer to data within the same component. It is just the path to the data. For example, score references the score state variable of the same component.

### Error handling
Error handling is abstracted away from the Blueprint -- it is all done by the software it is running on.

### Tips
1. Get creative! 
2. Don't forget you can call h1 tags, p tags, and divs as if they were components. They are in the HTML package, e.g. html.p, html.h1, html.div.
3.  A Blueprint represents an *entire page*. So it probably is wise to wrap the whole thing in a div with w-full h-screen (though of course not in all situations), and then probably use flex to arrange the rest of the components. This is supposed to be an entire well-designed webpage and so should include extensive use of components.

The page should be styled like a really good website, in whatever style the user appears to want! Default to what a good website looks like.
`;

const JsonSchema = {
  type: "object",
  properties: {
    id: {
      type: "string",
      description:
        'A globally unique, completely random, string-based identifier for the component. Use short, common words, e.g. "blue" or "fox" or "baby". Ensure that this is globally unique, otherwise the app will break.',
    },
    render: {
      type: "string",
      description:
        "A string representing the component to render. Only plain HTML tags are supported at the moment. Format: [packageName].[componentName], e.g. 'html.div' or 'html.p'",
    },
    imports: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description:
              "Alias for the import, to be used within this component.",
          },
          variable: {
            anyOf: [
              {
                type: "object",
                properties: {
                  type: {
                    type: "string",
                    const: "externalReference",
                  },
                  value: {
                    type: "string",
                    description:
                      "A reference to a value external to the component, e.g. header-user.name",
                  },
                },
                required: ["type", "value"],
                additionalProperties: false,
              },
            ],
          },
        },
        required: ["name", "variable"],
        additionalProperties: false,
      },
    },
    children: {
      type: "array",
      items: {
        type: "object",
        properties: {
          condition: {
            anyOf: [
              {
                type: "object",
                properties: {
                  type: {
                    type: "string",
                    const: "json",
                  },
                  value: {
                    anyOf: [
                      {
                        type: ["string", "number", "boolean", "null"],
                      },
                      {
                        type: "array",
                        items: {
                          $ref: "#/properties/children/items/properties/condition/anyOf/0/properties/value",
                        },
                      },
                      {
                        type: "object",
                        additionalProperties: {
                          $ref: "#/properties/children/items/properties/condition/anyOf/0/properties/value",
                        },
                      },
                    ],
                  },
                },
                required: ["type", "value"],
                additionalProperties: false,
                description:
                  "A static JSON value, e.g. 'text-red-500' or 5 or true or [1, 2] or { counter: 3 }.",
              },
              {
                type: "object",
                properties: {
                  type: {
                    type: "string",
                    const: "internalReference",
                  },
                  value: {
                    type: "string",
                    description:
                      "A reference to a value internal to the component, e.g. rectangle.left",
                  },
                },
                required: ["type", "value"],
                additionalProperties: false,
              },
              {
                $ref: "#/properties/imports/items/properties/variable/anyOf/0",
              },
              {
                type: "object",
                properties: {
                  type: {
                    type: "string",
                    const: "expr",
                  },
                  value: {
                    type: "string",
                    description:
                      "A JavaScript expression that will be evaluated on every render.",
                  },
                },
                required: ["type", "value"],
                additionalProperties: false,
              },
            ],
            description: "Child renders if the condition is truthy.",
          },
          map: {
            type: "object",
            properties: {
              name: {
                type: "string",
              },
              array: {
                $ref: "#/properties/children/items/properties/condition",
              },
              key: {
                type: "string",
                description:
                  "The field of each map item to use as key. Special values: 'index' or 'var'. Examples: key: 'index' or key: 'var.foo.bar.id'",
              },
            },
            required: ["name", "array", "key"],
            additionalProperties: false,
            description:
              "Replicates the functionality of the Array.map function. Creates as many copies of the child as there are elements in the array.Child components must EXPLICITLY reference this data to access it (it is not passed in by default). They will implicitly have the key of the element that they descend from, and so when they Reference this Map, they receive the Item, not the Array, with properties 'var' and 'index'. ",
          },
          child: {
            anyOf: [
              {
                $ref: "#/properties/children/items/properties/condition/anyOf/0",
              },
              {
                $ref: "#/properties/children/items/properties/condition/anyOf/1",
              },
              {
                $ref: "#/properties/imports/items/properties/variable/anyOf/0",
              },
              {
                $ref: "#/properties/children/items/properties/condition/anyOf/3",
              },
              {
                type: "object",
                properties: {
                  type: {
                    type: "string",
                    const: "blueprint-pointer",
                  },
                  value: {
                    type: "string",
                  },
                },
                required: ["type", "value"],
                additionalProperties: false,
              },
              {
                type: "object",
                properties: {
                  type: {
                    type: "string",
                    const: "blueprint",
                  },
                  value: {
                    $ref: "#",
                  },
                },
                required: ["type", "value"],
                additionalProperties: false,
              },
            ],
          },
        },
        required: ["child"],
        additionalProperties: false,
      },
    },
    state: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description:
              'The name of the declarator, e.g. "incrementCounter" for a function or expression that will be referenced in other Blueprints. Must be unique within the component.',
          },
          variable: {
            anyOf: [
              {
                $ref: "#/properties/children/items/properties/condition/anyOf/0",
              },
              {
                $ref: "#/properties/children/items/properties/condition/anyOf/1",
              },
              {
                $ref: "#/properties/imports/items/properties/variable/anyOf/0",
              },
            ],
          },
        },
        required: ["name", "variable"],
        additionalProperties: false,
      },
    },
    define: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: 'The name of the function, e.g. "incrementCounter"',
          },
          variable: {
            anyOf: [
              {
                type: "object",
                properties: {
                  type: {
                    type: "string",
                    const: "function",
                  },
                  value: {
                    type: "object",
                    properties: {
                      args: {
                        type: "array",
                        items: {
                          type: "string",
                        },
                        description:
                          "The args the function takes. Write 'e' as the first arg to pass in the handler event. ",
                      },
                      body: {
                        type: "string",
                        description:
                          "Plain JavaScript that will be run when the function is called.The JS is scoped to this component's state + any imported variable aliases.Attempting to access anything else will cause a runtime error.",
                      },
                    },
                    required: ["args", "body"],
                    additionalProperties: false,
                  },
                },
                required: ["type", "value"],
                additionalProperties: false,
              },
            ],
          },
        },
        required: ["name", "variable"],
        additionalProperties: false,
      },
    },
    props: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: {
            type: "string",
          },
          variable: {
            anyOf: [
              {
                $ref: "#/properties/children/items/properties/condition/anyOf/0",
              },
              {
                $ref: "#/properties/define/items/properties/variable/anyOf/0",
              },
              {
                $ref: "#/properties/children/items/properties/condition/anyOf/1",
              },
              {
                $ref: "#/properties/imports/items/properties/variable/anyOf/0",
              },
              {
                $ref: "#/properties/children/items/properties/condition/anyOf/3",
              },
            ],
          },
        },
        required: ["name", "variable"],
        additionalProperties: false,
      },
    },
  },
  required: ["id", "render"],
  additionalProperties: false,
};
