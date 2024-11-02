// translation from js to rs taking place

use std::collections::HashMap;
use std::collections::HashSet;
use crate::statements::StatementType;

pub struct Interpreter {
    variables: HashMap<String, Value>, 
    immutables: HashSet<String>, 
    functions: HashMap<String, Function>,
    local_scope: HashMap<String, Value>, 
    returning_from_func: bool,
}

// Assuming Value and Function types are defined somewhere in your code
impl Interpreter {
    pub fn new() -> Self {
        Self {
            variables: HashMap::new(),
            immutables: HashSet::new(),
            functions: HashMap::new(),
            local_scope: HashMap::new(),
            returning_from_func: false,
        }
    }

    pub fn execute(&mut self, statement: Statement) -> Result<Option<String>, String> {
        match statement.statement_type {
            StatementType::VariableDeclaration => self.handle_variable_declaration(statement),
            StatementType::ConnectStatement => self.handle_connect(statement),
            StatementType::Assignment => self.handle_assignment(statement),
            StatementType::PrintStatement => self.handle_print(statement),
            StatementType::ErrorStatement => self.handle_error(statement),
            StatementType::AlertStatement => self.handle_alert(statement),
            StatementType::RepeatStatement => self.handle_repeat(statement),
            StatementType::WhileStatement => self.handle_while(statement),
            StatementType::IfStatement => self.handle_if_statement(statement),
            StatementType::FunctionDeclaration => self.handle_function_declaration(statement),
            StatementType::ReturnFromFunc => self.handle_return_from_func(statement),
            StatementType::FunctionCall => self.execute_function_call(statement),
            StatementType::DeleteVariable => self.handle_delete_variable(statement),
            StatementType::DeleteFunction => self.handle_delete_function(statement),
            StatementType::AsyncBlock => return self.execute_async_block(statement),
            StatementType::VoidLiteral => return Ok(Some("void".to_string())),
            StatementType::ReadStatement => self.handle_read_statement(statement),
            StatementType::ArrayAdd => self.add_to_array(statement.array, statement.element),
            StatementType::ArrayRemove => self.remove_from_array(statement.array, statement.element),
            StatementType::ArrayLength => self.length_of_array(statement.array),
            StatementType::ArrayAccess => return self.handle_array_access(statement),
            StatementType::ToJSONStatement => return self.to_json_statement(statement),
            StatementType::ParseJSONStatement => return self.parse_json_statement(statement),
            StatementType::FloorMath => return self.handle_floor_math_statement(statement),
            StatementType::RoundMath => return self.handle_round_math_statement(statement),
            StatementType::SqrtMath => return self.handle_sqrt_math_statement(statement),
            StatementType::CosMath => return self.handle_cos_math_statement(statement),
            StatementType::SinMath => return self.handle_sin_math_statement(statement),
            StatementType::TanMath => return self.handle_tan_math_statement(statement),
            StatementType::TokenizeSentence => return self.tokenize_sentence(statement),
            StatementType::SentenceToLowerCase => return self.handle_sentence_to_lower_case(statement),
            StatementType::SentenceToUpperCase => return self.handle_sentence_to_upper_case(statement),
            StatementType::ReverseThings => return self.handle_reverse_things(statement),
            StatementType::InputCli => return self.handle_input_cli(statement.value),
            StatementType::FetchAPI => return self.handle_fetch_apis(statement.url.value),
            StatementType::ReturnCurrentTime => return self.handle_return_current_time(),
            _ => Err(format!("Unknown statement type: {:?}", statement.statement_type)),
        }
    }
}
