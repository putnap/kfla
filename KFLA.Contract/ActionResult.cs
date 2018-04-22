using System;

namespace KFLA.Contract
{
    public class ActionResult
    {
        public bool IsSuccess { get; set; }
        public string ErrorMessage { get; set; }

        protected ActionResult()
        {
            IsSuccess = true;
        }

        protected ActionResult(string errorMessage)
        {
            IsSuccess = false;
            ErrorMessage = errorMessage;
        }

        public static ActionResult Success()
        {
            return new ActionResult();
        }

        public static ActionResult Failure(string errorMessage)
        {
            return new ActionResult(errorMessage);
        }
    }

    public class ActionResult<T> : ActionResult
    {
        public T Item { get; set; }

        public ActionResult(T item) : base()
        {
            Item = item;
        }

        protected ActionResult(string errorMessage) : base(errorMessage)
        {
        }

#pragma warning disable CS0693 // Type parameter has the same name as the type parameter from outer type
        public static ActionResult<T> Success<T>(T item)
#pragma warning restore CS0693 // Type parameter has the same name as the type parameter from outer type
        {
            return new ActionResult<T>(item);
        }

#pragma warning disable CS0693 // Type parameter has the same name as the type parameter from outer type
        public static ActionResult<T> Failure<T>(string errorMessage)
#pragma warning restore CS0693 // Type parameter has the same name as the type parameter from outer type
        {
            return new ActionResult<T>(errorMessage);
        }
    }
}
