<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\MultiStepForm;
use App\Models\Question;

class QuestionSeeder extends Seeder
{
    public function run(): void
    {
        MultiStepForm::create([
                'step' => 5,
            ],
            [
                'step' => 6,
            ]);

        // Find or create MultiStepForm with step = 5
        $stepForm = MultiStepForm::firstOrCreate(['step' => 5]);

        $questions = [
            "Would you like to generate more income from your assets today?",
            "Is leaving a legacy (inheritance) behind important to you?",
            "Would you like to generate enough income without spending down the principle?",
            "Do You currently have a Will/POA/Living Will or Trust in Place Today?",
            "Are you expecting to receive an inheritance in the future?",
            "How many years have you been investing?",
            "What percentage of your portfolio has typically been allocated to stocks/equities?"
        ];

        foreach ($questions as $question) {
            Question::create([
                'question' => $question,
                'step_id' => $stepForm->id,
            ]);
        }

        $stepForm = MultiStepForm::firstOrCreate(['step' => 6]);

        $questions = [
            "Do You Worry About Maintaining Your Current Lifestyle in Retirement?",
            "Do You Feel Uneasy About Not Having a Clear Plan for Your Financial Future?",
            "Do You Want to Enjoy Your Retirement Without Spending Down Your Principle?",
            "Are Your Worried About Outliving Your Retirement Savings?",
            "Do You Want to Leave a Large Inheritance/Legacy If Possible?",
            "Are You Currently Working with a Financial Advisor?",
        ];

        foreach ($questions as $question) {
            Question::create([
                'question' => $question,
                'step_id' => $stepForm->id,
            ]);
        }
    }
}
