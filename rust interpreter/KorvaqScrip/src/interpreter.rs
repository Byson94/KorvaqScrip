use crate::ast::ASTNode;
use std::collections::HashMap;
use std::fmt;

#[derive(Debug, Clone)]
pub enum Value {
    String(String),
    Number(f64), 
    Boolean(bool),
}

impl fmt::Display for Value {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            Value::String(val) => write!(f, "{}", val),
            Value::Number(val) => write!(f, "{}", val),
            Value::Boolean(val) => write!(f, "{}", val),
        }
    }
}

// Define the Interpreter struct
pub struct Interpreter {
    variables: HashMap<String, (Value, bool)>, // Store variables
}

impl Interpreter {
    pub fn new() -> Self {
        Interpreter {
            variables: HashMap::new(),
        }
    }

    pub fn interpret(&mut self, ast: Vec<ASTNode>) -> Result<(), String> {
        for node in ast {
            match node {
                ASTNode::ShowStatement { value } => {
                    self.execute_show(value);
                }
                ASTNode::VariableDeclaration { name, is_constant, value } => {
                    self.handle_variable_declaration(name, is_constant, value)?;
                }
                ASTNode::DelVar { name } => {
                    self.handle_delvar_statement(name)?;
                }
                ASTNode::IfStatement { condition, consequent, alternative } => {
                    self.execute_if_statement(*condition, *consequent, alternative)?;
                }
                ASTNode::Block { statements } => {
                    for stmt in statements {
                        self.interpret(vec![stmt])?;
                    }
                }                
                ASTNode::Uppercase { expr } => {}
                ASTNode::Lowercase { expr } => {}
                ASTNode::ValueBool { value } => {}
                ASTNode::Variable { name } => {}
                ASTNode::Value { value } => {}
                ASTNode::ValueNum { value } => {}
                ASTNode::BinaryOperation { left, operator, right } => {
                    let result = self.evaluate_binary_operation(*left, operator, *right)?;
                    println!("{}", result); // Print the result of the binary operation
                }
                ASTNode::Identifier { name } => {
                    // Handle the identifier, such as printing or evaluating the variable
                    if let Some((var_value, _)) = self.variables.get(&name) {
                        println!("{}", var_value); // Print the value of the variable
                    } else {
                        println!("Error: Variable '{}' not found", name); // Error if variable is not found
                    }
                }
            }
        }
        Ok(()) // Return Ok if no errors occur
    }

    fn execute_if_statement(
        &mut self,
        condition: ASTNode,
        consequent: ASTNode,
        alternative: Option<Box<ASTNode>>,
    ) -> Result<(), String> {
        // Evaluate the condition to a boolean value
        let condition_value = self.evaluate_value(Box::new(condition))?;
        match condition_value {
            Value::Boolean(true) => {
                // Execute the consequent block if condition is true
                self.execute_block(consequent)
            }
            Value::Boolean(false) => {
                // Execute the alternative block if it exists and condition is false
                if let Some(alt) = alternative {
                    self.execute_block(*alt)
                } else {
                    Ok(()) // No alternative block, so do nothing
                }
            }
            _ => Err("Error: Condition expression must evaluate to a boolean".to_string()),
        }
    }

    fn execute_block(&mut self, block: ASTNode) -> Result<(), String> {
        match block {
            ASTNode::Block { statements } => {
                for stmt in statements {
                    self.interpret(vec![stmt.clone()])?; // Interpret each statement in the block
                }
                Ok(())
            }
            _ => Err("Expected a block of statements".to_string()),
        }
    }

    fn handle_delvar_statement(&mut self, name: String) -> Result<(), String> {
        // Check if the name is "all" to delete all mutable variables
        if name == "all" {
            let mut to_remove = Vec::new();
            
            // Collect names of mutable (non-constant) variables to remove
            for (var_name, (_, is_constant)) in &self.variables {
                if !*is_constant {
                    to_remove.push(var_name.clone());
                }
            }
    
            // Remove each collected mutable variable
            for var_name in to_remove {
                self.variables.remove(&var_name);
            }
    
            return Ok(());
        }
    
        // If name is not "all", proceed with single variable deletion
        if let Some((_, is_constant)) = self.variables.get(&name) {
            if *is_constant {
                return Err(format!("Error: Cannot delete constant '{}'", name));
            }
            self.variables.remove(&name);
            Ok(())
        } else {
            Err(format!("Error: Variable '{}' not found", name))
        }
    }
    

    // Execute a show statement
    fn execute_show(&mut self, value: Box<ASTNode>) {
        match *value {
            ASTNode::Value { value } => {
                // Print the value directly if it's a simple value
                println!("{}", value);
            }
            ASTNode::ValueNum { value } => {
                // Print the value directly if it's a simple value
                println!("{}", value);
            }
            ASTNode::ValueBool { value } => {
                // Print the value directly if it's a simple value
                println!("{}", value);
            }
            ASTNode::Variable { name } => {
                // Look up the variable in the context and print its value
                if let Some((var_value, _)) = self.variables.get(&name) {
                    println!("{}", var_value);
                } else {
                    println!("Error: Variable '{}' not found", name);
                }
            }
            ASTNode::BinaryOperation { left, operator, right } => {
                // If it's a binary operation, evaluate it first
                match self.evaluate_binary_operation(*left, operator, *right) {
                    Ok(result) => println!("{}", result),
                    Err(e) => println!("Error: {}", e),
                }
            }
            _ => {}
        }
    }
    

    fn handle_variable_declaration(&mut self, name: String, is_constant: bool, value_node: Box<ASTNode>) -> Result<(), String> {
        let value = self.evaluate_value(value_node)?;

        if let Some((_, existing_is_constant)) = self.variables.get(&name) {
            if *existing_is_constant {
                return Err(format!("Error: Constant '{}' cannot be reassigned", name));
            } else if is_constant {
                return Err(format!("Error: Mutable '{}' cannot be reassigned as constant", name));
            } else {
                self.variables.insert(name, (value, is_constant));
                return Ok(());
            }
        }

        self.variables.insert(name, (value, is_constant));
        Ok(())
    }

    fn evaluate_value(&mut self, value_node: Box<ASTNode>) -> Result<Value, String> {
        match *value_node {
            ASTNode::ValueNum { value } => Ok(Value::Number(value)),
            ASTNode::Value { value } => Ok(Value::String(value)),
            ASTNode::Identifier { name } => {
                if let Some((var_value, _)) = self.variables.get(&name) {
                    Ok(var_value.clone())
                } else {
                    Err(format!("Error: Variable '{}' not found", name))
                }
            }
            ASTNode::ValueBool { value } => Ok(Value::Boolean(value)), // Handling for boolean literals
            ASTNode::BinaryOperation { left, operator, right } => {
                self.evaluate_binary_operation(*left, operator, *right)
            }
            _ => Err("Invalid value node".to_string()),
        }
    }    

    fn evaluate_binary_operation(&mut self, left_node: ASTNode, operator: String, right_node: ASTNode) -> Result<Value, String> {
        let left_value = self.evaluate_value(Box::new(left_node))?;
        let right_value = self.evaluate_value(Box::new(right_node))?;
    
        match (left_value, right_value) {
            // Handle numeric operations
            (Value::Number(left), Value::Number(right)) => {
                match operator.as_str() {
                    "+" => Ok(Value::Number(left + right)),
                    "-" => Ok(Value::Number(left - right)),
                    "*" => Ok(Value::Number(left * right)),
                    "/" => {
                        if right == 0.0 {
                            Err("Error: Division by zero".to_string())
                        } else {
                            Ok(Value::Number(left / right))
                        }
                    }
                    "%" => Ok(Value::Number(left % right)),
                    "**" => Ok(Value::Number(left.powf(right))),
                    "==" => Ok(Value::Boolean(left == right)), // Equality check
                    "!=" => Ok(Value::Boolean(left != right)),
                    "<" => Ok(Value::Boolean(left < right)),
                    ">" => Ok(Value::Boolean(left > right)),
                    "<=" => Ok(Value::Boolean(left <= right)),
                    ">=" => Ok(Value::Boolean(left >= right)),
                    _ => Err(format!("Unsupported operator: {}", operator)),
                }
            }
            // Handle boolean operations
            (Value::Boolean(left), Value::Boolean(right)) => {
                match operator.as_str() {
                    "&&" => Ok(Value::Boolean(left && right)),
                    "||" => Ok(Value::Boolean(left || right)),
                    "==" => Ok(Value::Boolean(left == right)),
                    "!=" => Ok(Value::Boolean(left != right)),
                    _ => Err(format!("Unsupported boolean operator: {}", operator)),
                }
            }
            // Handle mixed types or unsupported operations
            (left, right) => Err(format!("Type mismatch or unsupported operation between {:?} and {:?}", left, right)),
        }
    }    
    

    // Assign a new value to a variable (check if it's mutable)
    pub fn assign_variable(&mut self, name: String, value_node: Box<ASTNode>) -> Result<(), String> {
        // Evaluate the value node to get the new value
        let value = self.evaluate_value(value_node)?;

        // Check if the variable exists and whether it's constant
        if let Some((existing_value, is_constant)) = self.variables.get_mut(&name) {
            if *is_constant {
                return Err(format!("Error: Cannot reassign constant '{}'", name));
            }

            // If it's mutable, update the value
            *existing_value = value;
        } else {
            return Err(format!("Error: Variable '{}' not defined", name));
        }

        Ok(())
    }
}
