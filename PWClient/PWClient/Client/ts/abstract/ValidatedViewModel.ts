abstract class ValidatedViewModel extends ViewModel {
    public create_validation(field: string, validator: Validator) {
        this[field+"__validator"] = validator;
    }
}