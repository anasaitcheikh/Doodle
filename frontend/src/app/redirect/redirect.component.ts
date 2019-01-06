import { Component, OnInit } from '@angular/core';
import  { ActivatedRoute, Router } from '@angular/router'

@Component({
  selector: 'app-redirect',
  templateUrl: './redirect.component.html',
  styleUrls: ['./redirect.component.css']
})
export class RedirectComponent implements OnInit {

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    const finalPath = this.route.snapshot.paramMap.get('final_path')
    console.log('path', finalPath)
    this.router.navigate([finalPath.replace('--', '/')])

  }

}
