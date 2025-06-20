<?php

namespace App\Enums;

enum ExpenseType: string
{
    case YOUR_NEEDS = 'you_needs';
    case YOUR_WANTS = 'your_wants';
    case LIABILITIES = 'liabilities';
    case LARGE_EXPENSE = 'large_expense';
}
