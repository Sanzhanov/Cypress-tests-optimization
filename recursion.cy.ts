//1. Iterating through nested elements
function validateNestedElements(element: JQuery<Element>): void {
    element.children().each(function () {
        const child = Cypress.$(this);
        if (child.children().length > 0) {
            validateNestedElements(child); // recursively call the same function
        } else {
            expect(child.text()).to.contain("expected text");
        }
    });
}

//2. Handling asynchronous operations
const clickElement = (selector: string, retries = 3): void => {
    if (retries === 0) {
        throw new Error(`Element not found: ${selector}`);
    }

    cy.get(selector, { timeout: 5000 })
        .then($element => {
            if (!$element) {
                clickElement(selector, retries - 1);
            } else {
                $element.click();
            }
        });
};

//3. Testing complex user interactions
interface FormField {
    name: string;
    required: boolean;
    value: string;
}

function fillForm(fields: FormField[], index = 0) {
    if (index >= fields.length) {
        cy.get('form').submit();
        return;
    }

    const field = fields[index];
    if (field.required && !field.value) {
        cy.get(`input[name="${field.name}"]`).type('test value');
    }

    fillForm(fields, index + 1);
}

//4. Building complex test flows
interface FormField {
    name: string;
    value: string;
}

interface FormPage {
    fields: FormField[];
    next?: () => void;
}

const pages: FormPage[] = [
    {
        fields: [
            { name: 'name', value: 'John' },
            { name: 'email', value: 'john@example.com' },
        ],
        next: () => fillFormPage(1),
    },
    {
        fields: [
            { name: 'password', value: 's3cr3t' },
            { name: 'confirm_password', value: 's3cr3t' },
        ],
        next: () => fillFormPage(2),
    },
    {
        fields: [
            { name: 'address', value: '123 Main St' },
            { name: 'city', value: 'Anytown' },
            { name: 'state', value: 'CA' },
            { name: 'zip', value: '12345' },
        ],
        next: () => submitForm(),
    },
];

function fillFormPage(pageIndex: number): void {
    const page = pages[pageIndex];
    page.fields.forEach(field => {
        cy.get(`input[name="${field.name}"]`).type(field.value);
    });
    if (page.next) {
        page.next();
    }
}

function submitForm(): void {
    cy.get('button[type="submit"]').click();
}

fillFormPage(0);

//5.
