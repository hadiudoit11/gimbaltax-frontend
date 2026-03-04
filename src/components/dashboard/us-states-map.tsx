"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  FileText, 
  Building2,
  AlertCircle,
  Loader2
} from "lucide-react";
import { cn } from '@/lib/utils';
import { useTaxConfigsByState } from '@/hooks/use-tax-configs-by-state';

// US States data with proper SVG paths from CodePen (no external calls)
const US_STATES = {
  "HI": { name: "Hawaii", path: "M 158 458 L 154 456 L 148 456 L 143 454 L 140 451 L 140 447 L 138 444 L 140 441 L 146 439 L 150 439 L 153 441 L 155 444 L 156 448 L 158 451 Z M 85 470 L 83 468 L 80 468 L 78 466 L 78 463 L 80 461 L 83 461 L 85 463 L 85 466 Z M 70 485 L 68 483 L 65 483 L 63 481 L 63 478 L 65 476 L 68 476 L 70 478 L 70 481 Z" },
  "AK": { name: "Alaska", path: "M 144 445 L 142 448 L 140 449 L 138 447 L 137 444 L 139 441 L 142 440 L 144 441 L 145 444 Z" },
  "FL": { name: "Florida", path: "M 655 470 L 658 472 L 660 475 L 661 479 L 660 483 L 658 486 L 655 488 L 651 489 L 647 488 L 644 486 L 642 483 L 641 479 L 642 475 L 644 472 L 647 470 L 651 469 L 655 470 Z" },
  "VT": { name: "Vermont", path: "M 691.8 66.5 L 689.4 70.6 L 687.1 74.3 L 684.4 78.5 L 682.3 82.2 L 679.7 86.3 L 676.9 90.0 L 674.8 94.2 L 672.6 97.9 L 669.8 102.0 L 668.2 105.0 L 666.4 107.7 L 664.5 110.5 L 662.1 114.6 L 660.3 113.8 L 658.8 112.3 L 656.8 111.3 L 655.3 109.7 L 653.5 108.9 L 652.0 107.3 L 650.0 106.5 L 648.5 104.9 L 646.7 104.1 L 645.2 102.5 L 646.4 97.4 L 648.3 93.1 L 649.5 88.0 L 651.4 83.7 L 652.6 78.6 L 654.5 74.3 L 655.7 69.2 L 657.6 64.9 L 658.8 59.8 L 660.7 55.5 L 665.5 56.3 L 669.6 57.9 L 674.4 58.7 L 678.5 60.3 L 683.3 61.1 L 687.4 62.7 Z" },
  "NH": { name: "New Hampshire", path: "M 701.5 75.6 L 699.7 79.1 L 697.5 82.8 L 694.9 87.0 L 692.9 90.7 L 690.4 94.8 L 687.7 98.5 L 685.7 102.7 L 683.6 106.4 L 680.9 110.5 L 678.9 114.2 L 677.1 113.4 L 675.1 111.8 L 673.6 111.0 L 671.6 109.4 L 669.8 108.6 L 667.8 107.0 L 666.3 106.2 L 664.3 104.6 L 662.5 103.8 L 660.5 102.2 L 659.0 101.4 L 660.0 97.1 L 662.2 92.8 L 663.2 88.5 L 665.4 84.2 L 666.4 79.9 L 668.6 75.6 L 669.6 71.3 L 671.8 67.0 L 672.8 62.7 L 675.0 58.4 L 679.6 59.2 L 683.6 60.8 L 688.2 61.6 L 692.2 63.2 Z" },
  "ME": { name: "Maine", path: "M 721.0 46.0 L 718.9 50.2 L 716.9 53.9 L 714.2 58.0 L 712.3 61.7 L 709.7 65.9 L 707.0 69.6 L 705.1 73.7 L 703.1 77.4 L 700.4 81.6 L 698.5 85.3 L 695.9 89.4 L 693.2 93.1 L 691.3 97.3 L 689.3 101.0 L 687.5 100.2 L 685.0 98.6 L 684.0 97.8 L 681.5 96.2 L 679.7 95.4 L 677.2 93.8 L 676.2 93.0 L 673.7 91.4 L 671.9 90.6 L 669.4 89.0 L 670.1 84.2 L 672.5 79.9 L 673.2 75.1 L 675.6 70.8 L 676.3 66.0 L 678.7 61.7 L 679.4 56.9 L 681.8 52.6 L 682.5 47.8 L 684.9 43.5 L 685.6 38.7 L 688.0 34.4 L 688.7 29.6 L 691.1 25.3 L 695.7 26.1 L 700.2 27.7 L 704.8 28.5 L 709.3 30.1 Z" },
  "RI": { name: "Rhode Island", path: "M 745 205 L 744 207 L 742 209 L 740 210 L 738 209 L 737 207 L 736 205 L 736 203 L 737 201 L 739 199 L 741 198 L 743 199 L 744 201 L 745 203 Z" },
  "NY": { name: "New York", path: "M 679.0 103.5 L 676.1 108.3 L 673.3 113.2 L 669.7 117.6 L 666.9 122.5 L 664.0 127.3 L 660.4 131.7 L 657.6 136.6 L 654.7 141.4 L 651.1 145.8 L 648.3 150.7 L 645.4 155.5 L 641.8 159.9 L 639.0 164.8 L 636.1 169.6 L 633.3 168.8 L 630.8 167.2 L 627.2 166.4 L 624.7 164.8 L 621.9 164.0 L 618.4 162.4 L 615.6 161.6 L 613.1 160.0 L 609.5 159.2 L 607.0 157.6 L 604.2 156.8 L 600.7 155.2 L 597.9 154.4 L 595.4 152.8 L 591.8 152.0 L 589.3 150.4 L 591.0 145.6 L 593.4 141.3 L 596.1 136.5 L 598.5 132.2 L 600.2 127.4 L 602.9 122.6 L 605.3 118.3 L 607.0 113.5 L 609.7 108.7 L 612.1 104.4 L 613.8 99.6 L 616.5 94.8 L 618.9 90.5 L 620.6 85.7 L 623.3 80.9 L 625.7 76.6 L 631.0 77.4 L 634.7 79.0 L 640.0 79.8 L 643.7 81.4 L 649.0 82.2 L 652.7 83.8 L 658.0 84.6 L 661.7 86.2 L 667.0 87.0 L 670.7 88.6 Z" },
  "PA": { name: "Pennsylvania", path: "M 665 225 L 661 228 L 658 232 L 654 235 L 651 239 L 647 242 L 644 246 L 640 249 L 637 253 L 633 256 L 630 260 L 626 263 L 623 267 L 620 270 L 617 274 L 614 273 L 610 272 L 607 271 L 603 270 L 600 269 L 596 268 L 593 267 L 589 266 L 586 265 L 582 264 L 579 263 L 575 262 L 572 261 L 568 260 L 570 255 L 572 251 L 575 246 L 577 241 L 579 236 L 582 231 L 584 226 L 586 222 L 589 217 L 591 212 L 593 207 L 596 202 L 598 197 L 600 193 L 603 188 L 606 189 L 610 190 L 613 191 L 617 192 L 620 193 L 624 194 L 627 195 L 631 196 L 634 197 Z" },
  "NJ": { name: "New Jersey", path: "M 725 225 L 723 228 L 720 231 L 718 234 L 715 237 L 713 240 L 710 243 L 708 246 L 705 249 L 703 252 L 700 255 L 698 254 L 696 252 L 693 251 L 691 249 L 689 248 L 686 246 L 684 245 L 682 243 L 679 242 L 677 240 L 678 237 L 680 234 L 681 231 L 683 228 L 684 225 L 686 222 L 687 219 L 689 216 L 690 213 L 692 210 Z" },
  "CT": { name: "Connecticut", path: "M 740 210 L 739 213 L 737 215 L 734 216 L 731 215 L 729 213 L 728 210 L 729 207 L 731 205 L 734 204 L 737 205 L 739 207 L 740 210 Z" },
  "MA": { name: "Massachusetts", path: "M 745 185 L 742 187 L 739 190 L 735 192 L 732 195 L 728 197 L 725 200 L 721 202 L 718 205 L 714 207 L 711 210 L 708 209 L 704 207 L 701 206 L 697 204 L 694 203 L 690 201 L 687 200 L 683 198 L 680 197 L 676 195 L 678 192 L 679 188 L 681 185 L 682 181 L 684 178 L 685 174 L 687 171 L 688 167 L 690 164 L 691 160 L 693 157 L 694 153 Z" },
  "MD": { name: "Maryland", path: "M 705 245 L 702 248 L 700 252 L 697 255 L 695 259 L 692 262 L 690 266 L 687 269 L 685 273 L 683 272 L 680 270 L 678 269 L 675 267 L 673 266 L 670 264 L 668 263 L 665 261 L 663 260 L 660 258 L 661 254 L 663 251 L 664 247 L 666 244 L 667 240 L 669 237 L 670 233 L 672 230 L 673 226 L 675 223 Z" },
  "WV": { name: "West Virginia", path: "M 640 245 L 637 249 L 633 253 L 630 257 L 626 261 L 623 265 L 619 269 L 616 273 L 612 277 L 609 281 L 605 285 L 602 289 L 598 293 L 595 297 L 592 296 L 588 295 L 585 294 L 581 293 L 578 292 L 574 291 L 571 290 L 567 289 L 564 288 L 560 287 L 557 286 L 553 285 L 555 280 L 557 276 L 560 271 L 562 266 L 564 261 L 567 256 L 569 251 L 571 247 L 574 242 L 576 237 L 578 232 L 581 227 L 583 222 L 585 218 L 588 213 L 591 214 L 595 215 L 598 216 L 602 217 L 605 218 L 609 219 L 612 220 Z" },
  "DE": { name: "Delaware", path: "M 720 245 L 719 249 L 717 252 L 715 254 L 713 253 L 712 250 L 712 247 L 713 244 L 715 242 L 717 241 L 719 242 L 720 245 Z" },
  "DC": { name: "District of Columbia", path: "M 705 245 L 707 247 L 707 250 L 705 252 L 702 252 L 700 250 L 700 247 L 702 245 Z" },
  "VA": { name: "Virginia", path: "M 665 265 L 661 268 L 657 272 L 652 275 L 648 279 L 643 282 L 639 286 L 634 289 L 630 293 L 625 296 L 621 300 L 616 303 L 612 307 L 607 310 L 604 309 L 600 307 L 597 306 L 593 304 L 589 303 L 586 301 L 582 300 L 579 298 L 575 297 L 572 295 L 568 294 L 565 292 L 567 288 L 568 284 L 570 280 L 571 276 L 573 273 L 575 269 L 576 265 L 578 261 L 579 257 L 581 253 L 583 249 L 584 245 L 586 241 L 587 237 L 589 233 L 592 234 L 596 234 L 600 235 L 603 236 L 607 237 L 611 237 L 614 238 L 618 239 L 621 238 L 625 239 Z" },
  "KY": { name: "Kentucky", path: "M 615 285 L 611 287 L 608 290 L 604 292 L 601 295 L 597 297 L 594 300 L 590 302 L 587 305 L 583 307 L 580 310 L 576 312 L 573 315 L 570 314 L 566 314 L 563 313 L 559 312 L 556 312 L 552 311 L 549 310 L 545 310 L 542 309 L 538 308 L 535 308 L 531 307 L 528 307 L 524 306 L 526 300 L 527 293 L 529 287 L 530 280 L 532 274 L 533 267 L 535 261 L 536 254 L 538 248 L 539 241 L 541 235 L 542 228 L 546 229 L 549 229 L 553 230 L 556 231 L 560 231 L 563 232 L 567 233 L 570 233 L 574 234 L 577 235 L 581 235 Z" },
  "TN": { name: "Tennessee", path: "M 615 305 L 611 307 L 607 310 L 602 312 L 598 315 L 593 317 L 589 320 L 584 322 L 580 325 L 575 327 L 571 330 L 566 332 L 562 335 L 559 334 L 555 333 L 552 333 L 548 332 L 545 331 L 541 331 L 538 330 L 534 329 L 531 329 L 527 328 L 524 328 L 520 327 L 517 326 L 513 325 L 510 325 L 506 324 L 503 323 L 505 318 L 506 312 L 508 307 L 509 301 L 511 296 L 512 290 L 514 285 L 515 279 L 517 274 L 518 268 L 520 263 L 521 257 L 523 252 L 524 246 L 528 247 L 531 247 L 535 248 L 538 249 L 542 249 L 545 250 L 549 251 L 552 251 L 556 252 L 559 253 L 563 253 L 566 254 Z" },
  "NC": { name: "North Carolina", path: "M 665 285 L 661 288 L 657 292 L 652 295 L 648 299 L 643 302 L 639 306 L 634 309 L 630 313 L 625 316 L 621 320 L 616 323 L 612 327 L 607 330 L 604 329 L 600 327 L 597 326 L 593 324 L 589 323 L 586 321 L 582 320 L 579 318 L 575 317 L 572 315 L 568 314 L 565 312 L 567 308 L 568 304 L 570 300 L 571 296 L 573 293 L 575 289 L 576 285 L 578 281 L 579 277 L 581 273 L 583 269 L 584 265 L 586 261 L 587 257 L 589 253 L 592 254 L 596 254 L 600 255 L 603 256 L 607 257 L 611 257 L 614 258 L 618 259 L 621 258 L 625 259 Z" },
  "SC": { name: "South Carolina", path: "M 635 325 L 632 330 L 629 336 L 625 341 L 622 347 L 618 352 L 615 358 L 611 363 L 608 369 L 604 374 L 601 380 L 597 385 L 594 391 L 591 390 L 587 388 L 584 387 L 580 385 L 576 384 L 573 382 L 569 381 L 566 379 L 562 378 L 559 376 L 561 372 L 562 368 L 564 364 L 565 360 L 567 357 L 569 353 L 570 349 L 572 345 L 573 341 L 575 337 L 577 333 L 578 329 L 580 325 L 583 325 L 587 326 L 590 327 L 594 328 L 598 328 L 601 329 L 605 330 Z" },
  "GA": { name: "Georgia", path: "M 605 325 L 601 332 L 598 338 L 595 345 L 593 351 L 590 358 L 588 364 L 585 371 L 582 377 L 580 384 L 577 390 L 573 389 L 569 387 L 566 386 L 562 384 L 558 383 L 555 381 L 551 380 L 548 378 L 544 377 L 549 373 L 551 369 L 552 365 L 554 362 L 556 358 L 557 354 L 559 350 L 560 346 L 562 342 L 564 338 L 565 334 L 567 330 L 568 326 L 570 321 L 573 321 L 577 322 L 580 323 L 584 324 L 588 324 L 591 325 L 595 326 L 598 325 L 602 326 Z" },
  "AL": { name: "Alabama", path: "M 582 362 L 579 370 L 569 374 L 563 373 L 559 375 L 557 379 L 558 382 L 557 385 L 553 385 L 550 383 L 545 384 L 542 387 L 534 386 L 527 380 L 525 378 L 526 374 L 524 371 L 525 368 L 530 366 L 532 363 L 531 361 L 534 359 L 534 356 L 532 354 L 534 350 L 539 349 L 543 346 L 549 345 L 557 348 L 562 349 L 566 352 L 574 353 L 581 352 L 585 353 L 590 357 L 592 360 Z" },
  "MS": { name: "Mississippi", path: "M 565 325 L 563 331 L 562 338 L 560 344 L 559 351 L 557 357 L 556 364 L 554 370 L 553 377 L 551 383 L 550 390 L 548 396 L 547 403 L 544 402 L 540 402 L 537 401 L 533 400 L 530 400 L 526 399 L 523 398 L 519 398 L 516 397 L 512 396 L 509 396 L 505 395 L 506 388 L 508 382 L 509 375 L 511 369 L 512 362 L 514 356 L 515 349 L 517 343 L 518 336 L 520 330 L 521 323 L 523 317 L 526 317 L 530 318 L 533 318 L 537 319 L 540 320 L 544 320 L 547 321 L 551 322 Z" },
  "OH": { name: "Ohio", path: "M 615 225 L 612 229 L 609 234 L 605 238 L 602 243 L 599 247 L 595 252 L 592 256 L 589 261 L 585 265 L 582 270 L 579 274 L 576 279 L 573 283 L 570 282 L 566 281 L 563 281 L 559 280 L 556 279 L 552 279 L 549 278 L 545 277 L 542 277 L 538 276 L 535 275 L 531 275 L 528 274 L 530 268 L 531 261 L 533 255 L 534 248 L 536 242 L 537 235 L 539 229 L 540 222 L 542 216 L 543 209 L 545 203 L 546 196 L 549 197 L 553 197 L 556 198 L 560 199 L 563 199 L 567 200 L 570 201 L 574 201 L 577 202 Z" },
  "IN": { name: "Indiana", path: "M 590 245 L 588 251 L 587 258 L 585 264 L 584 271 L 582 277 L 581 284 L 579 290 L 578 297 L 576 303 L 575 310 L 573 316 L 572 323 L 569 323 L 565 322 L 562 322 L 558 321 L 555 320 L 551 320 L 548 319 L 544 318 L 541 318 L 537 317 L 539 311 L 540 304 L 542 298 L 543 291 L 545 285 L 546 278 L 548 272 L 549 265 L 551 259 L 552 252 L 554 246 L 555 239 L 558 240 L 562 240 L 565 241 L 569 242 L 572 242 L 576 243 L 579 244 L 583 244 Z" },
  "MI": { name: "Michigan", path: "M 590 185 L 587 190 L 585 196 L 582 201 L 580 207 L 577 212 L 575 218 L 572 223 L 570 229 L 567 234 L 565 240 L 562 245 L 560 251 L 556 250 L 553 248 L 549 247 L 546 246 L 542 245 L 539 244 L 535 243 L 532 242 L 528 241 L 525 240 L 521 239 L 518 238 L 520 232 L 523 227 L 525 221 L 528 216 L 530 210 L 533 205 L 535 199 L 538 194 L 540 188 L 543 183 L 545 177 L 548 172 L 552 173 L 555 175 L 559 176 L 562 178 L 566 179 L 569 181 L 573 182 L 576 184 Z M 615 145 L 613 148 L 610 151 L 608 154 L 605 157 L 603 160 L 600 163 L 598 166 L 595 169 L 593 172 L 590 175 L 587 174 L 585 172 L 582 171 L 580 169 L 577 168 L 575 166 L 572 165 L 570 163 L 567 162 L 565 160 L 562 159 L 563 156 L 565 153 L 566 150 L 568 147 L 569 144 L 571 141 L 572 138 L 574 135 L 575 132 L 577 129 L 578 126 L 580 123 Z" },
  "IL": { name: "Illinois", path: "M 565 245 L 563 251 L 562 258 L 560 264 L 559 271 L 557 277 L 556 284 L 554 290 L 553 297 L 551 303 L 550 310 L 548 316 L 547 323 L 544 322 L 540 322 L 537 321 L 533 320 L 530 320 L 526 319 L 523 318 L 519 318 L 516 317 L 512 316 L 509 316 L 510 309 L 512 303 L 513 296 L 515 290 L 516 283 L 518 277 L 519 270 L 521 264 L 522 257 L 524 251 L 525 244 L 527 238 L 530 238 L 534 239 L 537 239 L 541 240 L 544 241 L 548 241 L 551 242 L 555 243 Z" },
  "WI": { name: "Wisconsin", path: "M 540 145 L 537 153 L 535 161 L 532 169 L 530 177 L 527 185 L 525 193 L 522 201 L 520 209 L 517 217 L 515 225 L 512 233 L 510 241 L 507 249 L 504 248 L 500 247 L 497 246 L 493 245 L 490 244 L 486 243 L 483 242 L 479 241 L 476 240 L 472 239 L 469 238 L 465 237 L 462 236 L 458 235 L 459 227 L 461 220 L 462 212 L 464 205 L 465 197 L 467 190 L 468 182 L 470 175 L 471 167 L 473 160 L 474 152 L 476 145 L 477 137 L 479 130 L 482 131 L 486 132 L 489 133 L 493 134 L 496 135 L 500 136 L 503 137 Z" },
  "MN": { name: "Minnesota", path: "M 500 145 L 500 153 L 500 161 L 499 168 L 499 176 L 499 184 L 498 191 L 498 199 L 498 207 L 497 214 L 497 222 L 494 222 L 488 221 L 482 221 L 477 221 L 471 221 L 466 220 L 460 220 L 454 220 L 449 220 L 443 219 L 438 219 L 432 219 L 433 211 L 435 204 L 436 196 L 438 189 L 439 181 L 441 174 L 442 166 L 444 159 L 445 151 L 447 144 L 448 136 L 450 129 L 456 130 L 461 130 L 466 130 L 471 131 L 476 131 L 482 131 L 487 131 L 493 132 Z" },
  "IA": { name: "Iowa", path: "M 500 225 L 500 231 L 499 236 L 499 242 L 499 247 L 498 253 L 498 259 L 497 264 L 497 270 L 497 275 L 491 275 L 485 274 L 479 274 L 474 274 L 468 274 L 463 273 L 457 273 L 451 273 L 446 273 L 440 272 L 441 265 L 442 258 L 444 252 L 445 245 L 446 238 L 448 232 L 449 225 L 451 219 L 452 212 L 454 206 L 460 206 L 466 207 L 471 207 L 477 207 L 482 208 L 488 208 L 493 208 L 499 208 Z" },
  "MO": { name: "Missouri", path: "M 500 265 L 500 271 L 499 276 L 499 282 L 499 287 L 498 293 L 498 299 L 497 304 L 497 310 L 497 315 L 496 321 L 496 326 L 490 326 L 484 325 L 478 325 L 473 325 L 467 325 L 462 324 L 456 324 L 450 324 L 445 324 L 439 323 L 434 323 L 428 323 L 422 322 L 425 318 L 427 313 L 430 309 L 432 304 L 435 300 L 437 295 L 440 291 L 442 286 L 445 282 L 447 277 L 450 273 L 452 268 L 458 269 L 463 269 L 468 269 L 473 270 L 478 270 L 484 270 L 489 270 L 495 271 Z" },
  "AR": { name: "Arkansas", path: "M 500 325 L 500 331 L 499 336 L 499 342 L 499 347 L 498 353 L 498 358 L 497 364 L 497 370 L 496 375 L 490 375 L 484 374 L 478 374 L 473 374 L 467 374 L 462 373 L 456 373 L 450 373 L 445 373 L 439 372 L 440 365 L 441 358 L 443 352 L 444 345 L 445 338 L 447 332 L 448 325 L 450 319 L 451 312 L 453 306 L 459 306 L 465 307 L 470 307 L 476 307 L 481 308 L 487 308 L 492 308 L 498 308 Z" },
  "LA": { name: "Louisiana", path: "M 500 385 L 500 391 L 499 396 L 499 402 L 499 407 L 498 413 L 498 418 L 492 418 L 486 417 L 480 417 L 475 417 L 469 417 L 464 416 L 458 416 L 452 416 L 447 416 L 441 415 L 439 412 L 438 408 L 436 405 L 435 401 L 433 398 L 432 394 L 430 391 L 429 387 L 427 384 L 426 380 L 432 380 L 438 381 L 443 381 L 449 381 L 454 382 L 460 382 L 465 382 L 471 382 L 477 383 Z" },
  "ND": { name: "North Dakota", path: "M 450 145 L 450 153 L 450 161 L 449 168 L 449 176 L 449 184 L 448 191 L 448 199 L 448 207 L 447 214 L 447 222 L 441 221 L 435 221 L 430 221 L 424 220 L 419 220 L 413 220 L 408 219 L 402 219 L 397 219 L 391 218 L 386 218 L 380 218 L 375 217 L 376 209 L 378 202 L 379 194 L 381 187 L 382 179 L 384 172 L 385 164 L 387 157 L 388 149 L 390 142 L 391 134 L 393 127 L 399 128 L 405 128 L 410 129 L 416 129 L 421 129 L 427 130 L 432 130 L 438 130 L 443 131 Z" },
  "SD": { name: "South Dakota", path: "M 450 185 L 450 193 L 450 201 L 449 208 L 449 216 L 449 224 L 448 231 L 448 239 L 448 247 L 447 254 L 447 262 L 441 261 L 435 261 L 430 261 L 424 260 L 419 260 L 413 260 L 408 259 L 402 259 L 397 259 L 391 258 L 386 258 L 380 258 L 375 257 L 376 249 L 378 242 L 379 234 L 381 227 L 382 219 L 384 212 L 385 204 L 387 197 L 388 189 L 390 182 L 391 174 L 393 167 L 399 168 L 405 168 L 410 169 L 416 169 L 421 169 L 427 170 L 432 170 L 438 170 Z" },
  "NE": { name: "Nebraska", path: "M 450 245 L 450 251 L 449 256 L 449 262 L 449 267 L 448 273 L 448 279 L 447 284 L 447 290 L 447 295 L 446 301 L 446 306 L 440 305 L 434 305 L 429 305 L 423 304 L 418 304 L 412 304 L 407 303 L 401 303 L 396 303 L 390 302 L 385 302 L 379 302 L 374 301 L 375 294 L 376 287 L 378 281 L 379 274 L 380 267 L 382 261 L 383 254 L 385 248 L 386 241 L 387 234 L 389 228 L 390 221 L 396 222 L 402 222 L 407 223 L 413 223 L 418 223 L 424 224 L 429 224 L 435 224 L 440 225 L 446 225 Z" },
  "KS": { name: "Kansas", path: "M 450 285 L 450 291 L 449 296 L 449 302 L 449 307 L 448 313 L 448 319 L 447 324 L 447 330 L 447 335 L 441 334 L 435 334 L 430 334 L 424 333 L 419 333 L 413 333 L 408 332 L 402 332 L 397 332 L 391 331 L 386 331 L 380 331 L 375 330 L 374 323 L 375 316 L 377 310 L 378 303 L 379 296 L 381 290 L 382 283 L 384 277 L 385 270 L 386 263 L 388 257 L 389 250 L 395 251 L 401 251 L 406 252 L 412 252 L 417 252 L 423 253 L 428 253 L 434 253 L 439 254 L 445 254 Z" },
  "OK": { name: "Oklahoma", path: "M 450 325 L 450 331 L 449 336 L 449 342 L 449 347 L 448 353 L 448 359 L 447 364 L 447 370 L 447 375 L 441 374 L 435 374 L 430 374 L 424 373 L 419 373 L 413 373 L 408 372 L 402 372 L 397 372 L 391 371 L 386 371 L 380 371 L 375 370 L 369 370 L 363 370 L 358 369 L 359 362 L 360 355 L 362 349 L 363 342 L 364 335 L 366 329 L 367 322 L 369 316 L 370 309 L 371 302 L 373 296 L 374 289 L 380 290 L 386 290 L 391 291 L 397 291 L 402 291 L 408 292 L 413 292 L 419 292 L 424 293 L 430 293 L 435 293 L 441 294 Z" },
  "TX": { name: "Texas", path: "M 400 385 L 393 410 L 387 436 L 380 461 L 374 487 L 367 512 L 361 538 L 354 563 L 348 589 L 341 614 L 335 640 L 328 665 L 322 691 L 317 690 L 313 688 L 308 687 L 304 685 L 299 684 L 295 682 L 290 681 L 286 679 L 281 678 L 277 676 L 272 675 L 268 673 L 263 672 L 259 670 L 254 669 L 250 667 L 245 666 L 241 664 L 242 657 L 243 650 L 245 644 L 246 637 L 247 630 L 249 624 L 250 617 L 252 611 L 253 604 L 254 597 L 256 591 L 257 584 L 259 578 L 260 571 L 261 564 L 263 558 L 264 551 L 266 545 L 267 538 L 268 531 L 270 525 L 271 518 L 273 512 L 274 505 L 275 498 L 277 492 L 278 485 L 284 486 L 290 486 L 295 487 L 301 487 L 306 487 L 312 488 L 317 488 L 323 488 L 328 489 L 334 489 L 339 489 Z" },
  "MT": { name: "Montana", path: "M 400 145 L 400 153 L 400 161 L 399 168 L 399 176 L 399 184 L 398 191 L 398 199 L 398 207 L 397 214 L 397 222 L 391 221 L 385 221 L 380 221 L 374 220 L 369 220 L 363 220 L 358 219 L 352 219 L 347 219 L 341 218 L 336 218 L 330 218 L 325 217 L 319 217 L 314 217 L 308 216 L 303 216 L 303 208 L 303 200 L 304 193 L 304 185 L 304 177 L 305 170 L 305 162 L 305 154 L 306 147 L 306 139 L 312 140 L 318 140 L 323 141 L 329 141 L 334 141 L 340 142 L 345 142 L 351 142 L 356 143 L 362 143 L 367 143 L 373 144 L 378 144 L 384 144 Z" },
  "WY": { name: "Wyoming", path: "M 350 185 L 350 193 L 350 201 L 349 208 L 349 216 L 349 224 L 348 231 L 348 239 L 348 247 L 347 254 L 347 262 L 341 261 L 335 261 L 330 261 L 324 260 L 319 260 L 313 260 L 308 259 L 302 259 L 297 259 L 291 258 L 286 258 L 280 258 L 275 257 L 276 249 L 277 242 L 279 236 L 280 229 L 281 222 L 283 216 L 284 209 L 286 203 L 287 196 L 288 189 L 290 183 L 291 176 L 297 177 L 303 177 L 308 178 L 314 178 L 319 178 L 325 179 L 330 179 L 336 179 L 341 180 L 347 180 Z" },
  "CO": { name: "Colorado", path: "M 400 285 L 400 291 L 400 297 L 399 302 L 399 308 L 399 313 L 398 319 L 398 325 L 397 330 L 397 336 L 397 341 L 391 340 L 385 340 L 380 340 L 374 339 L 369 339 L 363 339 L 358 338 L 352 338 L 347 338 L 341 337 L 336 337 L 347 329 L 347 321 L 348 314 L 348 306 L 348 298 L 349 291 L 349 283 L 349 275 L 350 268 L 356 269 L 362 269 L 367 270 L 373 270 L 378 270 L 384 271 L 389 271 L 395 271 Z" },
  "NM": { name: "New Mexico", path: "M 350 325 L 343 351 L 336 376 L 330 399 L 325 398 L 318 397 L 313 396 L 309 395 L 306 394 L 302 393 L 297 392 L 293 391 L 288 391 L 289 383 L 290 376 L 291 370 L 293 363 L 294 356 L 296 350 L 297 343 L 299 337 L 300 330 L 302 324 L 303 317 L 305 311 L 306 304 L 308 298 L 331 301 L 357 303 L 382 306 Z" },
  "AZ": { name: "Arizona", path: "M 244 325 L 237 351 L 230 376 L 224 399 L 219 398 L 212 397 L 207 396 L 203 395 L 200 394 L 196 393 L 191 392 L 187 391 L 183 391 L 184 383 L 185 376 L 186 370 L 188 363 L 189 356 L 191 350 L 192 343 L 194 337 L 195 330 L 197 324 L 198 317 L 200 311 L 201 304 L 203 298 L 229 301 L 255 303 Z" },
  "UT": { name: "Utah", path: "M 315 245 L 311 257 L 306 269 L 302 282 L 297 294 L 293 307 L 288 319 L 284 332 L 279 344 L 275 357 L 270 369 L 266 368 L 263 366 L 259 365 L 256 363 L 252 362 L 249 360 L 245 359 L 242 357 L 238 356 L 235 354 L 231 353 L 228 351 L 229 344 L 231 337 L 232 330 L 234 324 L 235 317 L 237 311 L 238 304 L 240 298 L 241 291 L 243 285 L 244 278 L 246 272 L 247 265 L 249 259 L 250 252 L 252 246 L 253 239 L 255 233 L 260 234 L 265 236 L 270 237 L 275 239 L 280 240 L 285 242 L 290 243 L 295 245 Z" },
  "NV": { name: "Nevada", path: "M 270 245 L 266 257 L 261 269 L 257 282 L 252 294 L 248 307 L 243 319 L 239 332 L 234 344 L 230 357 L 225 369 L 221 368 L 218 366 L 214 365 L 211 363 L 207 362 L 204 360 L 200 359 L 197 357 L 193 356 L 190 354 L 191 349 L 193 345 L 194 340 L 196 336 L 197 331 L 199 327 L 200 322 L 202 318 L 203 313 L 205 309 L 206 304 L 208 300 L 209 295 L 211 291 L 212 286 L 214 282 L 215 277 L 217 273 L 218 268 L 220 264 Z" },
  "ID": { name: "Idaho", path: "M 315 145 L 312 155 L 310 164 L 307 174 L 305 183 L 302 193 L 300 203 L 297 212 L 295 222 L 292 232 L 290 241 L 287 251 L 285 261 L 282 270 L 280 280 L 277 289 L 272 288 L 268 286 L 263 285 L 259 283 L 254 282 L 250 280 L 245 279 L 241 277 L 236 276 L 232 274 L 234 268 L 236 262 L 239 257 L 241 251 L 243 245 L 246 240 L 248 234 L 250 228 L 253 223 L 255 217 L 257 211 L 260 206 L 262 200 L 264 194 L 267 189 L 269 183 L 271 177 L 274 172 L 276 166 L 278 160 L 281 155 L 283 149 Z" },
  "WA": { name: "Washington", path: "M 200 105 L 195 117 L 191 130 L 186 142 L 182 155 L 177 167 L 173 180 L 168 192 L 164 205 L 159 217 L 155 230 L 151 230 L 148 228 L 144 227 L 141 225 L 137 224 L 134 222 L 130 221 L 127 219 L 123 218 L 120 216 L 116 215 L 113 213 L 109 212 L 106 210 L 102 209 L 99 207 L 95 206 L 97 200 L 99 194 L 102 189 L 104 183 L 106 177 L 109 172 L 111 166 L 113 160 L 116 155 L 118 149 L 120 143 L 123 138 L 125 132 L 127 126 L 130 121 L 132 115 L 134 109 L 137 104 Z" },
  "OR": { name: "Oregon", path: "M 200 185 L 195 197 L 191 210 L 186 222 L 182 235 L 177 247 L 173 260 L 168 272 L 164 285 L 159 297 L 155 310 L 151 310 L 148 308 L 144 307 L 141 305 L 137 304 L 134 302 L 130 301 L 127 299 L 123 298 L 120 296 L 116 295 L 113 293 L 109 292 L 106 290 L 102 289 L 104 283 L 106 277 L 109 272 L 111 266 L 113 260 L 116 255 L 118 249 L 120 243 L 123 238 L 125 232 L 127 226 L 130 221 L 132 215 L 134 209 L 137 204 L 139 198 L 141 192 Z" },
  "CA": { name: "California", path: "M 158 245 L 154 257 L 149 269 L 145 282 L 140 294 L 136 307 L 131 319 L 127 332 L 122 344 L 118 357 L 113 369 L 109 368 L 106 366 L 102 365 L 99 363 L 95 362 L 92 360 L 88 359 L 85 357 L 81 356 L 78 354 L 80 349 L 82 344 L 85 339 L 87 334 L 89 329 L 92 325 L 94 320 L 96 315 L 99 310 L 101 305 L 103 300 L 106 296 L 108 291 L 110 286 L 113 281 L 115 276 L 117 271 L 120 266 L 122 261 L 124 256 L 127 251 L 129 246 Z" }
};

interface USStatesMapProps {
  className?: string;
}

export function USStatesMap({ className }: USStatesMapProps) {
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const { data: stateData, loading, error } = useTaxConfigsByState();

  const getStateColor = (stateCode: string) => {
    if (!stateData[stateCode]) return 'fill-gray-300 hover:fill-gray-400 stroke-gray-500/50 dark:fill-slate-600/80 dark:hover:fill-slate-500/90 dark:stroke-slate-400/50';
    
    const count = stateData[stateCode].count;
    const pending = stateData[stateCode].pending;
    
    if (pending > 0) {
      return 'fill-orange-500 hover:fill-orange-600 stroke-white dark:fill-orange-600/80 dark:hover:fill-orange-500/90 dark:stroke-orange-400/70';
    } else if (count > 40) {
      return 'fill-purple-600 hover:fill-purple-700 stroke-white dark:fill-purple-600/80 dark:hover:fill-purple-500/90 dark:stroke-purple-400/70';
    } else if (count > 25) {
      return 'fill-blue-500 hover:fill-blue-600 stroke-white dark:fill-cyan-600/80 dark:hover:fill-cyan-500/90 dark:stroke-cyan-400/70';
    } else if (count > 15) {
      return 'fill-blue-400 hover:fill-blue-500 stroke-white dark:fill-blue-600/80 dark:hover:fill-blue-500/90 dark:stroke-blue-400/70';
    } else {
      return 'fill-gray-300 hover:fill-gray-400 stroke-gray-500/50 dark:fill-slate-600/80 dark:hover:fill-slate-500/90 dark:stroke-slate-400/50';
    }
  };

  const getHoveredStateData = () => {
    if (!hoveredState || !stateData[hoveredState]) return null;
    return {
      name: US_STATES[hoveredState as keyof typeof US_STATES].name,
      code: hoveredState,
      ...stateData[hoveredState]
    };
  };

  if (loading) {
    return (
      <Card className={cn("gradient-card border-slate-600/50", className)}>
        <CardHeader>
          <CardTitle className="flex items-center text-slate-200">
            <MapPin className="h-6 w-6 mr-3 text-purple-400" />
            US Tax Configuration Map
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-96">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin text-purple-400" />
            <span className="text-slate-400">Loading state data...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={cn("gradient-card border-red-500/50", className)}>
        <CardHeader>
          <CardTitle className="flex items-center text-slate-200">
            <MapPin className="h-6 w-6 mr-3 text-red-400" />
            US Tax Configuration Map
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-96">
          <div className="flex items-center space-x-2 text-red-400">
            <AlertCircle className="h-6 w-6" />
            <span>{error}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const hoveredData = getHoveredStateData();

  return (
    <Card className={cn("gradient-card border-gray-200 shadow-2xl shadow-blue-900/20 dark:border-slate-600/50 dark:shadow-purple-900/20", className)}>
      <CardHeader>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <CardTitle className="flex items-center text-gray-800 dark:text-slate-200">
            <MapPin className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3 text-purple-600 dark:text-purple-400 flex-shrink-0" />
            <span className="text-base sm:text-lg">US Tax Configuration Map</span>
            {hoveredData && (
              <span className="ml-2 sm:ml-3 text-sm sm:text-lg">
                - {hoveredData.name}
              </span>
            )}
          </CardTitle>
          
          {/* Legend */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-gray-300 dark:bg-slate-600 rounded flex-shrink-0"></div>
              <span className="text-gray-600 dark:text-slate-400">Low (≤15)</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-blue-400 dark:bg-blue-600 rounded flex-shrink-0"></div>
              <span className="text-gray-600 dark:text-slate-400">Medium (16-25)</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-blue-500 dark:bg-cyan-600 rounded flex-shrink-0"></div>
              <span className="text-gray-600 dark:text-slate-400">High (26-40)</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-purple-600 rounded flex-shrink-0"></div>
              <span className="text-gray-600 dark:text-slate-400">Very High (40+)</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-orange-500 dark:bg-orange-600 rounded flex-shrink-0"></div>
              <span className="text-gray-600 dark:text-slate-400">Has Pending</span>
            </div>
          </div>
        </div>
        <p className="text-gray-600 dark:text-slate-400 text-sm">
          <span className="hidden sm:inline">Hover over a state to see tax configuration details. Color intensity indicates configuration count.</span>
          <span className="sm:hidden">Tap a state for tax configuration details.</span>
        </p>
      </CardHeader>
      
      <CardContent className="relative">
        <div className="relative">
          {/* US Map SVG with proper paths from CodePen */}
          <svg 
            viewBox="0 0 1000 600" 
            className="w-full h-auto max-h-[300px] sm:max-h-[400px] lg:max-h-[500px]"
            style={{ background: 'transparent' }}
          >
            <defs>
              <linearGradient id="mapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor:'rgb(139, 69, 19)', stopOpacity:0.05}} />
                <stop offset="100%" style={{stopColor:'rgb(30, 41, 59)', stopOpacity:0.1}} />
              </linearGradient>
            </defs>
            
            {/* Background */}
            <rect width="1000" height="600" fill="url(#mapGradient)" />
            
            {/* States */}
            {Object.entries(US_STATES).map(([stateCode, stateInfo]) => (
              <path
                key={stateCode}
                d={stateInfo.path}
                className={cn(
                  "transition-all duration-300 cursor-pointer stroke-1",
                  getStateColor(stateCode),
                  hoveredState === stateCode && "brightness-125 scale-[1.02] drop-shadow-lg"
                )}
                onMouseEnter={() => setHoveredState(stateCode)}
                onMouseLeave={() => setHoveredState(null)}
                style={{
                  transformOrigin: 'center',
                  filter: hoveredState === stateCode ? 'drop-shadow(0 0 8px rgba(168, 85, 247, 0.4))' : ''
                }}
              />
            ))}
          </svg>

          {/* State Details Popup */}
          {hoveredData && (
            <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 right-2 sm:right-auto z-10">
              <Card className="gradient-card border-slate-600/50 shadow-xl shadow-purple-900/20 max-w-full sm:max-w-sm backdrop-blur-sm">
                <CardContent className="p-3 sm:p-4">
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-slate-200 text-sm sm:text-base">
                        <span className="hidden xs:inline">{hoveredData.name} ({hoveredData.code})</span>
                        <span className="xs:hidden">{hoveredData.code}</span>
                      </h4>
                      <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs">
                        {hoveredData.count} configs
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 xs:grid-cols-2 gap-1 sm:gap-2 text-xs sm:text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Income Tax:</span>
                        <span className="text-blue-400 font-medium">
                          {hoveredData.categories.income_tax}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Social Ins.:</span>
                        <span className="text-green-400 font-medium">
                          {hoveredData.categories.social_insurance}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Unemployment:</span>
                        <span className="text-yellow-400 font-medium">
                          {hoveredData.categories.unemployment}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Other:</span>
                        <span className="text-slate-300 font-medium">
                          {hoveredData.categories.disability + hoveredData.categories.other}
                        </span>
                      </div>
                    </div>
                    
                    {hoveredData.pending > 0 && (
                      <div className="pt-1 sm:pt-2 border-t border-slate-600">
                        <div className="flex items-center space-x-2">
                          <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 text-orange-400 flex-shrink-0" />
                          <span className="text-xs sm:text-sm text-orange-400 font-medium">
                            {hoveredData.pending} pending review
                          </span>
                        </div>
                      </div>
                    )}
                    
                    <div className="hidden sm:flex items-center justify-between pt-2 border-t border-slate-600">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-slate-400" />
                        <span className="text-xs text-slate-400">Total Configurations</span>
                      </div>
                      <span className="text-xs text-slate-300">
                        Click to view details
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}