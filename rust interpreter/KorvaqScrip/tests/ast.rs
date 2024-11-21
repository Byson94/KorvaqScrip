#[derive(Debug, Clone)]
pub enum ASTNode {
    VariableDeclaration { name: String, is_constant: bool, value: Box<ASTNode> },
    ShowStatement { value: Box<ASTNode> },
    Value { value: String },
    ValueBool { value: bool },
    ValueNum { value: f64 },
    Variable { name: String },
    Identifier { name: String },
    BinaryOperation {
        left: Box<ASTNode>,
        operator: String,
        right: Box<ASTNode>,
    },
    DelVar { name: String },
    IfStatement {
        condition: Box<ASTNode>,
        consequent: Box<ASTNode>,
        alternative: Option<Box<ASTNode>>,
    },
    Block {
        statements: Vec<ASTNode>,
    },
    Uppercase { expr: Box<ASTNode> },
    Lowercase { expr: Box<ASTNode> },
}